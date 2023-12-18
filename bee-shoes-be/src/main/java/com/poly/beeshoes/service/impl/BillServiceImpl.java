package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.request.CartClientRequest;
import com.poly.beeshoes.dto.request.bill.BillRequest;
import com.poly.beeshoes.dto.request.bill.BillSearchRequest;
import com.poly.beeshoes.dto.request.billdetail.BillClientRequest;
import com.poly.beeshoes.dto.request.giveback.GivebackRequest;
import com.poly.beeshoes.dto.response.BillResponse;
import com.poly.beeshoes.dto.response.statistic.StatisticBillStatus;
import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.entity.BillHistory;
import com.poly.beeshoes.entity.Notification;
import com.poly.beeshoes.entity.PaymentMethod;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.constant.BillDetailStatusConstant;
import com.poly.beeshoes.infrastructure.constant.BillStatusConstant;
import com.poly.beeshoes.infrastructure.constant.NotificationType;
import com.poly.beeshoes.infrastructure.constant.PaymentMethodConstant;
import com.poly.beeshoes.infrastructure.constant.TyperOrderConstant;
import com.poly.beeshoes.infrastructure.converter.BillConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.session.ShoseSession;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.IBillDetailRepository;
import com.poly.beeshoes.repository.IBillHistoryRepository;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.INotificationRepository;
import com.poly.beeshoes.repository.IPaymentMethodRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.repository.IVoucherRepository;
import com.poly.beeshoes.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private IBillHistoryRepository billHistoryRepository;
    @Autowired
    private BillConvert billConvert;
    @Autowired
    private INotificationRepository notificationRepository;
    @Autowired
    private IAccountRepository accountRepository;
    @Autowired
    private IPaymentMethodRepository paymentMethodRepository;
    @Autowired
    private IVoucherRepository voucherRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private IBillDetailRepository billDetailRepository;
    @Autowired
    private ShoseSession session;

    @Override
    public PageableObject<BillResponse> getAll(BillSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(billRepository.getAll(request, pageable));
    }

    @Override
    public List<Bill> getNewBill(BillSearchRequest request) {
        return billRepository.getNewBill(request);
    }

    @Override
    public Bill getOne(Long id) {
        return billRepository.findById(id).orElse(null);
    }

    @Override
    public Bill findByCode(String code) {
        return billRepository.findByCode(code);
    }

    private String genBillCode() {
        String prefix = "HD150300";
        int x = 1;
        String code = prefix + x;
        while (billRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public Bill create() {
        if (billRepository.findByAccountIdAndStatusAndDeletedFalse(session.getEmployee().getId(), BillStatusConstant.TAO_DON_HANG, PageRequest.of(0, 10)).getContent().size() >= 5) {
            throw new RestApiException("Chỉ được tạo tối đa 5 đơn hàng!");
        }
        Bill bill = new Bill();
        BillHistory billHistory = new BillHistory();
        bill.setAccount(accountRepository.findById(session.getEmployee().getId()).get());
        bill.setStatus(BillStatusConstant.TAO_DON_HANG);
        bill.setCode(this.genBillCode());
        Bill billSave = billRepository.save(bill);
        billHistory.setBill(billSave);
        billHistory.setStatus(billSave.getStatus());
        billHistory.setNote("Tạo đơn hàng");
        billHistoryRepository.save(billHistory);
        return billSave;
    }

    @Override
    public Bill orderBill(Long id, BillRequest request) {
        if (request.getVoucher() != null) {
            Voucher voucher = voucherRepository.findById(request.getVoucher()).get();
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }
        BillHistory history = new BillHistory();
        PaymentMethod paymentMethod = new PaymentMethod();
        Bill bill = billConvert.convertRequestToEntity(billRepository.findById(id).get(), request);
        history.setBill(bill);
        paymentMethod.setBill(bill);
        paymentMethod.setType(PaymentMethodConstant.TIEN_KHACH_DUA);

        if (request.getWaitPay()) {
            bill.setStatus(BillStatusConstant.CHO_THANH_TOAN);
            history.setStatus(BillStatusConstant.CHO_THANH_TOAN);
            billHistoryRepository.save(history);
            billRepository.save(bill);
            return bill;
        }

        if (request.getType() == TyperOrderConstant.TAI_QUAY) {
            bill.setStatus(BillStatusConstant.HOAN_THANH);
            bill.setReceiveDate(System.currentTimeMillis());
            BillHistory history1 = new BillHistory();
            history1.setBill(bill);
            history1.setNote("Đã xác nhận thông tin thanh toán!");
            history1.setStatus(BillStatusConstant.XAC_NHAN_THONG_TIN_THANH_TOAN);
            billHistoryRepository.save(history1);
            if (request.getPaymentMethod() == PaymentMethodConstant.TIEN_MAT) {
                paymentMethod.setTotalMoney(bill.getTotalMoney());
                paymentMethod.setNote("Đã thanh toán tiền mặt!");
                paymentMethod.setMethod(PaymentMethodConstant.TIEN_MAT);
                paymentMethodRepository.save(paymentMethod);
            } else if (request.getPaymentMethod() == PaymentMethodConstant.CHUYEN_KHOAN) {
                paymentMethod.setTotalMoney(bill.getTotalMoney());
                paymentMethod.setNote("Đã chuyển khoản!");
                paymentMethod.setTradingCode(request.getTradingCode());
                paymentMethod.setMethod(PaymentMethodConstant.CHUYEN_KHOAN);
                paymentMethodRepository.save(paymentMethod);
            } else if (request.getPaymentMethod() == PaymentMethodConstant.TIEN_MAT_VA_CHUYEN_KHOAN) {
                PaymentMethod paymentMethod1 = new PaymentMethod();
                paymentMethod1.setBill(bill);
                paymentMethod1.setTotalMoney(request.getTienMat());
                paymentMethod1.setNote("Đã thanh toán!");
                paymentMethod1.setMethod(PaymentMethodConstant.TIEN_MAT);
                paymentMethod1.setType(PaymentMethodConstant.TIEN_KHACH_DUA);
                paymentMethodRepository.save(paymentMethod1);
                paymentMethod.setTotalMoney(request.getTienChuyenKhoan());
                paymentMethod.setTradingCode(request.getTradingCode());
                paymentMethod.setNote("Đã chuyển khoản!");
                paymentMethod.setMethod(PaymentMethodConstant.CHUYEN_KHOAN);
                paymentMethodRepository.save(paymentMethod);
            }
            history.setNote("Mua hàng thành công!");
            history.setStatus(BillStatusConstant.HOAN_THANH);
        } else if (request.getType() == TyperOrderConstant.GIAO_HANG) {
            bill.setStatus(BillStatusConstant.CHO_GIAO);
            history.setStatus(BillStatusConstant.CHO_GIAO);
            history.setNote("Chờ giao");
            if (request.getPaymentMethod() == PaymentMethodConstant.CHUYEN_KHOAN) {
                BillHistory history1 = new BillHistory();
                history1.setBill(bill);
                history1.setNote("Đã xác nhận thông tin thanh toán!");
                history1.setStatus(BillStatusConstant.XAC_NHAN_THONG_TIN_THANH_TOAN);
                billHistoryRepository.save(history1);
                paymentMethod.setTotalMoney(bill.getTotalMoney().add(bill.getMoneyShip()));
                paymentMethod.setNote("Đã chuyển khoản!");
                paymentMethod.setTradingCode(request.getTradingCode());
                paymentMethod.setMethod(PaymentMethodConstant.CHUYEN_KHOAN);
                paymentMethodRepository.save(paymentMethod);
            } else if (request.getPaymentMethod() == PaymentMethodConstant.TIEN_MAT_VA_CHUYEN_KHOAN) {
                paymentMethod.setTotalMoney(request.getTienChuyenKhoan());
                paymentMethod.setNote("Đã chuyển khoản!");
                paymentMethod.setTradingCode(request.getTradingCode());
                paymentMethod.setMethod(PaymentMethodConstant.CHUYEN_KHOAN);
                paymentMethodRepository.save(paymentMethod);
            }
        }
        billHistoryRepository.save(history);
        billRepository.save(bill);
        if (bill.getCustomer() != null) {
            Notification notification = new Notification();
            notification.setType(NotificationType.CHUA_DOC);
            notification.setAccount(bill.getCustomer());
            if (bill.getStatus() == BillStatusConstant.HOAN_THANH) {
                notification.setTitle("Đơn hàng #" + bill.getCode() + " đã được mua thành công");
                notification.setContent("Đơn hàng #" + bill.getCode() + " đã được mua thành công, hãy liên hệ với chúng tôi nếu sản phẩm có vấn đề");
                notificationRepository.save(notification);
            } else {
                notification.setTitle("Đơn hàng #" + bill.getCode() + " đã được xác nhận và đang chờ vận chuyển đi");
                notification.setContent("Đơn hàng #" + bill.getCode() + " đã được xác nhận và đang chờ vận chuyển đi." +
                        " Trong thời gian này, bạn vẫn có thể thay đổi số lượng sản phẩm hoặc địa chỉ nhận hàng nếu cần thiết.");
                notificationRepository.save(notification);
            }
        }
        return bill;
    }

    @Override
    public Bill updateBill() {
        return null;
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject createBillClient(BillClientRequest request) {
        Bill bill = new Bill();
        BillHistory billHistory = new BillHistory();
        if (request.getAccount() != null) {
            bill.setCustomer(accountRepository.findById(request.getAccount()).orElse(null));
        }
        bill.setStatus(BillStatusConstant.CHO_XAC_NHAN);
        bill.setCode(this.genBillCode());
        bill.setType(TyperOrderConstant.GIAO_HANG);
        bill.setNote(request.getNote());
        bill.setPhoneNumber(request.getPhoneNumber());
        bill.setCustomerName(request.getCustomerName());
        bill.setAddress(request.getSpecificAddress() + "##" + request.getWard() + "##" + request.getDistrict() + "##" + request.getProvince());
        bill.setMoneyShip(request.getMoneyShip());
        bill.setMoneyReduce(request.getMoneyReduce());
        bill.setTotalMoney(request.getTotalMoney());
        if(request.getVoucher() != null){
            Voucher voucher = voucherRepository.findById(request.getVoucher()).get();
            voucher.setQuantity(voucher.getQuantity()-1);
            voucherRepository.save(voucher);
            bill.setVoucher(voucher);
        }

        Bill billSave = billRepository.save(bill);
        billHistory.setBill(billSave);
        billHistory.setStatus(billSave.getStatus());
        billHistory.setNote("Chờ xác nhận");
        billHistoryRepository.save(billHistory);

        for (CartClientRequest x : request.getCarts()) {
            ShoeDetail shoeDetail = shoeDetailRepository.findById(x.getId()).get();
            BillDetail billDetail = new BillDetail();
            billDetail.setBill(bill);
            billDetail.setQuantity(x.getQuantity());
            billDetail.setShoeDetail(shoeDetail);
            billDetail.setPrice(shoeDetail.getPrice());
            billDetail.setStatus(false);
            billDetailRepository.save(billDetail);
            if(shoeDetail.getQuantity() <= 0){
                throw new RestApiException("Sản phẩm " + shoeDetail.getShoe().getName()
                        + " [" + shoeDetail.getColor().getName()+"-" + shoeDetail.getSize().getName()+"] đã hết hàng!");
            }
            if(shoeDetail.getQuantity() < x.getQuantity()){
                throw new RestApiException(shoeDetail.getShoe().getName()
                        + " [" + shoeDetail.getColor().getName()+"-" + shoeDetail.getSize().getName()+"] chỉ được mua tối đa " + shoeDetail.getQuantity() + " sản phẩm!");
            }
            shoeDetail.setQuantity(shoeDetail.getQuantity() - x.getQuantity());
            shoeDetailRepository.save(shoeDetail);
        }
        if (bill.getCustomer() != null) {
            Account account = bill.getCustomer();
            Notification notification = new Notification();
            notification.setTitle("Đơn hàng của bạn đã được đặt");
            notification.setContent("Xin chào " + account.getName() + ", đơn hàng với mã vận đơn " +
                    bill.getCode() + " đã được hệ thống ghi nhận và đang chờ nhân viên xác nhận. " +
                    "Cảm ơn bạn đã dành thời gian cho BeeShoes!");
            notification.setAccount(account);
            notification.setType(NotificationType.CHUA_DOC);
            notificationRepository.save(notification);
        }
        return new ResponseObject(bill);
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject createBillClientVnpay(BillClientRequest request, String code) {
        Bill bill = new Bill();
        BillHistory billHistory = new BillHistory();
        if (request.getAccount() != null) {
            bill.setCustomer(accountRepository.findById(request.getAccount()).orElse(null));
        }
        bill.setStatus(BillStatusConstant.CHO_XAC_NHAN);
        if(request.getVoucher() != null){
            Voucher voucher = voucherRepository.findById(request.getVoucher()).get();
            voucher.setQuantity(voucher.getQuantity()-1);
            voucherRepository.save(voucher);
            bill.setVoucher(voucher);
        }
        bill.setCode(this.genBillCode());
        bill.setType(TyperOrderConstant.GIAO_HANG);
        bill.setNote(request.getNote());
        bill.setPhoneNumber(request.getPhoneNumber());
        bill.setCustomerName(request.getCustomerName());
        bill.setAddress(request.getSpecificAddress() + "##" + request.getWard() + "##" + request.getDistrict() + "##" + request.getProvince());
        bill.setMoneyShip(request.getMoneyShip());
        bill.setMoneyReduce(request.getMoneyReduce());
        bill.setTotalMoney(request.getTotalMoney());
        if (request.getVoucher() != null) {
            bill.setVoucher(voucherRepository.findById(request.getVoucher()).get());
        }

        Bill billSave = billRepository.save(bill);
        billHistory.setBill(billSave);
        billHistory.setStatus(billSave.getStatus());
        billHistory.setNote("Chờ xác nhận");
        billHistoryRepository.save(billHistory);

        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setBill(billSave);
        paymentMethod.setType(PaymentMethodConstant.TIEN_KHACH_DUA);
        paymentMethod.setMethod(PaymentMethodConstant.CHUYEN_KHOAN);
        paymentMethod.setTradingCode(code);
        paymentMethod.setTotalMoney(billSave.getTotalMoney().add(billSave.getMoneyShip()));
        paymentMethod.setNote("Đã thanh toán");
        paymentMethodRepository.save(paymentMethod);

        for (CartClientRequest x : request.getCarts()) {
            ShoeDetail shoeDetail = shoeDetailRepository.findById(x.getId()).get();
            BillDetail billDetail = new BillDetail();
            billDetail.setBill(bill);
            billDetail.setQuantity(x.getQuantity());
            billDetail.setShoeDetail(shoeDetail);
            billDetail.setPrice(shoeDetail.getPrice());
            billDetail.setStatus(false);
            billDetailRepository.save(billDetail);
            shoeDetail.setQuantity(shoeDetail.getQuantity() - x.getQuantity());
            if(shoeDetail.getQuantity() < 0){
                throw new RestApiException("Sản phẩm này đã hết hàng!");
            }
            shoeDetailRepository.save(shoeDetail);
        }
        if (bill.getCustomer() != null) {
            Account account = bill.getCustomer();
            Notification notification = new Notification();
            notification.setTitle("Đơn hàng của bạn đã được đặt");
            notification.setContent("Xin chào " + account.getName() + ", đơn hàng với mã vận đơn " +
                    bill.getCode() + " đã được hệ thống ghi nhận và đang chờ nhân viên xác nhận. " +
                    "Cảm ơn bạn đã dành thời gian cho BeeShoes!");
            notification.setAccount(account);
            notification.setType(NotificationType.CHUA_DOC);
            notificationRepository.save(notification);
        }
        return new ResponseObject(bill);
    }

    @Override
    public Bill delete(Long id) {
        return null;
    }

    @Override
    public Bill changeStatus(Long id, String note, Boolean isCancel) {
        Bill bill = billRepository.findById(id).get();
        BillHistory history = new BillHistory();
        history.setBill(bill);
        history.setNote(note);

        List<PaymentMethod> paymentMethods = paymentMethodRepository.findByBillIdAndType(bill.getId(), PaymentMethodConstant.TIEN_KHACH_DUA);
        Double totalPayment = 0.0;
        for (PaymentMethod x : paymentMethods) {
            totalPayment += x.getTotalMoney().doubleValue();
        }
        if (isCancel) {
            for (BillDetail x : billDetailRepository.findByBillId(bill.getId())) {
                ShoeDetail shoeDetail = x.getShoeDetail();
                shoeDetail.setQuantity(shoeDetail.getQuantity() + x.getQuantity());
                shoeDetailRepository.save(shoeDetail);
            }
            history.setStatus(BillStatusConstant.DA_HUY);
            bill.setStatus(BillStatusConstant.DA_HUY);
        } else {
            if (bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN) {
                if (BigDecimal.valueOf(totalPayment).compareTo(bill.getTotalMoney().add(bill.getMoneyShip())) < 0) {
                    throw new RestApiException("Vui lòng hoàn tất thanh toán!");
                } else {
                    history.setStatus(BillStatusConstant.HOAN_THANH);
                    bill.setStatus(BillStatusConstant.HOAN_THANH);
                }
            } else {
                if (bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN) {
                    history.setStatus(BillStatusConstant.CHO_GIAO);
                    bill.setStatus(BillStatusConstant.CHO_GIAO);
                } else {
                    if (bill.getStatus() == BillStatusConstant.DANG_GIAO) {
                        if (BigDecimal.valueOf(totalPayment).compareTo(bill.getTotalMoney().add(bill.getMoneyShip())) < 0) {
                            throw new RestApiException("Vui lòng hoàn tất thanh toán!");
                        }
                    }
                    bill.setStatus(bill.getStatus() + 1);
                    history.setStatus(bill.getStatus());
                }
            }
        }

        if (bill.getStatus() == BillStatusConstant.HOAN_THANH) {
            bill.setReceiveDate(System.currentTimeMillis());
        } else if (bill.getStatus() == BillStatusConstant.DANG_GIAO) {
            bill.setShipDate(new Date());
        } else if (bill.getStatus() == BillStatusConstant.XAC_NHAN_THONG_TIN_THANH_TOAN) {
            bill.setPayDate(new Date());
        }

        Bill billSave = billRepository.save(bill);

        if (billSave.getCustomer() != null) {
            Account account = bill.getCustomer();
            Notification notification = new Notification();
            notification.setTitle(billSave.getStatus() == BillStatusConstant.HOAN_THANH
                    ? "Đơn hàng #" + billSave.getCode() + " đã được giao thành công"
                    : billSave.getStatus() == BillStatusConstant.DANG_GIAO
                    ? "Đơn hàng #" + billSave.getCode() + " đang trên đường giao đến bạn"
                    : billSave.getStatus() == BillStatusConstant.CHO_GIAO
                    ? "Đơn hàng #" + billSave.getCode() + " đã được xác nhận"
                    : billSave.getStatus() == BillStatusConstant.DA_HUY
                    ? "Đơn hàng #" + billSave.getCode() + " đã bị hủy"
                    : "");
            notification.setContent(billSave.getStatus() == BillStatusConstant.HOAN_THANH
                    ? "Xin chào " + account.getName() + ". Đơn hàng #" + billSave.getCode() + " đã được giao thành công"
                    : billSave.getStatus() == BillStatusConstant.DANG_GIAO
                    ? "Xin chào " + account.getName() + ". Đơn hàng #" + billSave.getCode() + " đang trên đường giao đến bạn. Hãy chú ý điện thoại để nhân viên giao hàng có thể liên lạc được với bạn nhé!"
                    : billSave.getStatus() == BillStatusConstant.CHO_GIAO
                    ? "Xin chào " + account.getName() + ". Đơn hàng #" + billSave.getCode() + " đã được xác nhận và chờ vận chuyển"
                    : billSave.getStatus() == BillStatusConstant.DA_HUY
                    ? "Xin chào " + account.getName() + ". Đơn hàng #" + billSave.getCode() + " đã bị hủy"
                    : "");
            notification.setAccount(account);
            notification.setType(NotificationType.CHUA_DOC);
            notificationRepository.save(notification);
        }
        if (billSave != null) {
            billHistoryRepository.save(history);
        }
        return billSave;
    }

    @Override
    public Bill changeInfoCustomer(Long id, BillRequest request) {
        Bill bill = billRepository.findById(id).orElse(null);
        bill.setCustomerName(request.getCustomerName());
        bill.setPhoneNumber(request.getPhoneNumber());
        bill.setEmail(request.getEmail());
        bill.setAddress(request.getAddress());
        bill.setMoneyShip(request.getMoneyShip());

        BillHistory history = new BillHistory();
        history.setBill(bill);
        history.setStatus(BillStatusConstant.CHINH_SUA_DON_HANG);
        history.setNote("Cập nhật thông tin khách hàng");
        billHistoryRepository.save(history);
        return billRepository.save(bill);
    }

    @Override
    public List<StatisticBillStatus> statisticBillStatus() {
        return billRepository.statisticBillStatus();
    }

    @Override
    public ResponseObject givebackAll(Long idBill, String note) {
        Bill bill = billRepository.findById(idBill).get();
        bill.setStatus(BillStatusConstant.DA_HUY);
        billRepository.save(bill);
        billDetailRepository.findByBillId(idBill).forEach(billDetail -> {
            billDetail.setStatus(BillDetailStatusConstant.TRA_HANG);
            billDetailRepository.save(billDetail);
        });

        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill);
        billHistory.setNote(note);
        billHistory.setStatus(BillStatusConstant.TRA_HANG);
        billHistoryRepository.save(billHistory);
        BillHistory history = new BillHistory();
        history.setBill(bill);
        history.setNote("Đơn hàng đã bị hủy");
        history.setStatus(BillStatusConstant.DA_HUY);
        billHistoryRepository.save(history);
        if (bill.getCustomer() != null) {
            Notification notification = new Notification();
            notification.setType(NotificationType.CHUA_DOC);
            notification.setAccount(bill.getCustomer());
            notification.setTitle("Đơn hàng #" + bill.getCode() + " đã bị hủy");
            notification.setTitle("Xin chào " + bill.getCustomer().getName() + ". Đơn hàng #" + bill.getCode() +
                    " đã bị hủy do trả toàn bộ sản phẩm trong hóa đơn.");
        }
        return new ResponseObject(bill);
    }

    @Override
    public ResponseObject giveback(GivebackRequest request) {
        BillDetail billDetail = billDetailRepository.findById(request.getBillDetail()).get();
        ShoeDetail shoeDetail = billDetail.getShoeDetail();
        Bill bill = billDetail.getBill();
        bill.setVoucher(null);
        bill.setStatus(BillStatusConstant.TRA_HANG);
        BillDetail billReturnCheck = billDetailRepository.findByShoeDetailCodeAndBillIdAndStatus(shoeDetail.getCode(), bill.getId(), Boolean.TRUE);
        if (request.getQuantity() <= 0) {
            throw new RestApiException("Vui lòng nhập số lượng hợp lệ!");
        }
        if (request.getQuantity() > billDetail.getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        if (request.getQuantity() == billDetail.getQuantity()) {
            bill.setTotalMoney((bill.getTotalMoney()
                    .add(bill.getMoneyReduce()))
                    .subtract(BigDecimal.valueOf(billDetail.getPrice().doubleValue() * request.getQuantity())));
            billRepository.save(bill);
            if (billReturnCheck != null) {
                billDetail.setQuantity(billDetail.getQuantity() - request.getQuantity());
                billDetail.setStatus(BillDetailStatusConstant.TRA_HANG);
                if (billDetail.getQuantity() == 0) {
                    billDetailRepository.delete(billDetail);
                } else {
                    billDetailRepository.save(billDetail);
                }
                billReturnCheck.setQuantity(billReturnCheck.getQuantity() + request.getQuantity());
                billDetailRepository.save(billReturnCheck);
            } else {
                billDetail.setStatus(BillDetailStatusConstant.TRA_HANG);
                if (billDetail.getQuantity() == 0) {
                    billDetailRepository.delete(billDetail);
                } else {
                    billDetailRepository.save(billDetail);
                }
            }
        } else if (request.getQuantity() < billDetail.getQuantity()) {
            if (billReturnCheck != null) {
                billReturnCheck.setQuantity(billReturnCheck.getQuantity() + request.getQuantity());
                billDetailRepository.save(billReturnCheck);
            } else {
                BillDetail billDeReturn = new BillDetail();
                billDeReturn.setQuantity(request.getQuantity());
                billDeReturn.setShoeDetail(shoeDetail);
                billDeReturn.setBill(bill);
                billDeReturn.setPrice(billDetail.getPrice());
                billDeReturn.setStatus(BillDetailStatusConstant.TRA_HANG);
                billDetailRepository.save(billDeReturn);
            }
            billDetail.setQuantity(billDetail.getQuantity() - request.getQuantity());
            bill.setTotalMoney((bill.getTotalMoney()
                    .add(bill.getMoneyReduce()))
                    .subtract(BigDecimal.valueOf(billDetail.getPrice().doubleValue() * request.getQuantity())));
            billRepository.save(bill);
            if (billDetail.getQuantity() == 0) {
                billDetailRepository.delete(billDetail);
            } else {
                billDetailRepository.save(billDetail);
            }
        }

        BillHistory history = new BillHistory();
        history.setBill(bill);
        history.setStatus(BillStatusConstant.TRA_HANG);
        history.setNote("Trả sản phẩm \"" + shoeDetail.getShoe().getName() + " [" + shoeDetail.getColor().getName() +
                "-" + shoeDetail.getSize().getName() + "]\" - Số lượng: \"" + request.getQuantity() + "\". Lý do: " + request.getNote());
        billHistoryRepository.save(history);
        if (billDetailRepository.findByBillAndStatus(bill, false).isEmpty()) {
            bill.setStatus(BillStatusConstant.DA_HUY);
            billRepository.save(bill);
            BillHistory billHistory = new BillHistory();
            billHistory.setBill(bill);
            billHistory.setNote("Đơn hàng đã bị hủy");
            billHistory.setStatus(BillStatusConstant.DA_HUY);
            billHistoryRepository.save(billHistory);
        }
        return new ResponseObject(billDetail);
    }
}
