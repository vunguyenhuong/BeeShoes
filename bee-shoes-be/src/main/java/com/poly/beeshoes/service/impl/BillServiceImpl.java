package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.response.statistic.StatisticBillStatus;
import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.entity.BillHistory;
import com.poly.beeshoes.entity.PaymentMethod;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.constant.BillStatusConstant;
import com.poly.beeshoes.infrastructure.converter.BillConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.dto.request.billdetail.BillClientRequest;
import com.poly.beeshoes.dto.request.CartClientRequest;
import com.poly.beeshoes.dto.request.bill.BillRequest;
import com.poly.beeshoes.dto.request.bill.BillSearchRequest;
import com.poly.beeshoes.dto.response.BillResponse;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.IBillDetailRepository;
import com.poly.beeshoes.repository.IBillHistoryRepository;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.IPaymentMethodRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.repository.IVoucherRepository;
import com.poly.beeshoes.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
    private IAccountRepository accountRepository;
    @Autowired
    private IPaymentMethodRepository paymentMethodRepository;
    @Autowired
    private IVoucherRepository voucherRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private IBillDetailRepository billDetailRepository;

    @Override
    public PageableObject<BillResponse> getAll(BillSearchRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(billRepository.getAll(request, pageable));
    }

    @Override
    public Bill getOne(Long id) {
        return billRepository.findById(id).orElse(null);
    }

    private String genBillCode() {
        String prefix = "HD100";
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
        if (billRepository.findByAccountIdAndStatusAndDeletedFalse(1L, BillStatusConstant.TAO_DON_HANG, PageRequest.of(0, 10)).getContent().size() >= 5) {
            throw new RestApiException("Chỉ được tạo tối đa 5 đơn hàng!");
        }
        Bill bill = new Bill();
        BillHistory billHistory = new BillHistory();
        bill.setAccount(accountRepository.findById(1L).get());
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
    public Bill update(Long id, BillRequest request) {
        BillHistory history = new BillHistory();
        PaymentMethod paymentMethod = new PaymentMethod();
        Bill oldBill = billRepository.findById(id).get();
        Bill billSave = billRepository.save(billConvert.convertRequestToEntity(oldBill, request));
        if (billSave != null) {
            if (billSave.getStatus() == 6) {
                history.setNote("Mua hàng thành công");
            } else if (request.getStatus() == 2) {
                history.setNote("Đang chờ xác nhận");
            } else if (billSave.getStatus() == 0) {
                history.setNote("Chờ thanh toán");
            }
            history.setStatus(billSave.getStatus());
            history.setBill(billSave);
            billHistoryRepository.save(history);
        }
        if(request.getType() == 1 && request.getStatus() == 2){
            BillHistory billHistory = new BillHistory();
            billSave.setStatus(BillStatusConstant.CHO_GIAO);
            billRepository.save(billSave);
            billHistory.setNote("Chờ giao");
            billHistory.setStatus(BillStatusConstant.CHO_GIAO);
            billHistory.setBill(billSave);
            billHistoryRepository.save(billHistory);
        }
        if (request.getPaymentMethod() == 0 && request.getStatus() == 6) {
            paymentMethod.setTotalMoney(request.getTotalMoney());
            paymentMethod.setMethod(request.getPaymentMethod());
            paymentMethod.setBill(billSave);
            paymentMethod.setNote("Đã thanh toán");
            paymentMethodRepository.save(paymentMethod);
        }
        return billSave;
    }

    @Override
    public ResponseObject createBillClient(BillClientRequest request) {
        Bill bill = new Bill();
        BillHistory billHistory = new BillHistory();
        bill.setAccount(accountRepository.findById(1L).get());
        bill.setStatus(BillStatusConstant.CHO_XAC_NHAN);
        bill.setCode(this.genBillCode());
        bill.setType(1);
        bill.setNote(request.getNote());
        bill.setAddress(request.getSpecificAddress()+"##"+request.getWard()+"##"+request.getDistrict()+"##"+request.getProvince());
        bill.setMoneyShip(request.getMoneyShip());
        bill.setMoneyReduce(request.getMoneyReduce());
        bill.setTotalMoney(request.getTotalMoney());
        if(request.getVoucher()!=null){
            bill.setVoucher(voucherRepository.findById(request.getVoucher()).get());
        }

        Bill billSave = billRepository.save(bill);
        billHistory.setBill(billSave);
        billHistory.setStatus(billSave.getStatus());
        billHistory.setNote("Chờ xác nhận");
        billHistoryRepository.save(billHistory);

        for (CartClientRequest x: request.getCarts()) {
            ShoeDetail shoeDetail = shoeDetailRepository.findById(x.getId()).get();
            BillDetail billDetail = new BillDetail();
            billDetail.setBill(bill);
            billDetail.setQuantity(x.getQuantity());
            billDetail.setShoeDetail(shoeDetail);
            billDetail.setPrice(shoeDetail.getPrice());
            billDetailRepository.save(billDetail);
            shoeDetail.setQuantity(shoeDetail.getQuantity()-x.getQuantity());
            shoeDetailRepository.save(shoeDetail);
        }
        return new ResponseObject("OK");
    }

    @Override
    public Bill delete(Long id) {
        return null;
    }

    @Override
    public Bill changeStatus(Long id, String note) {
        Bill bill = billRepository.findById(id).get();
        BillHistory history = new BillHistory();
        history.setBill(bill);
        history.setNote(note);
        if(bill.getStatus() == BillStatusConstant.CHO_THANH_TOAN){
            if(bill.getType() == 0){
                bill.setStatus(BillStatusConstant.HOAN_THANH);
            }
        }else {
            if(bill.getStatus() == BillStatusConstant.CHO_XAC_NHAN){
                history.setStatus(BillStatusConstant.CHO_GIAO);
                bill.setStatus(BillStatusConstant.CHO_GIAO);
            }else {
                if(bill.getStatus() == BillStatusConstant.DANG_GIAO){
                    if(!paymentMethodRepository.existsByBillId(bill.getId())){
                        throw new RestApiException("Vui lòng xác nhận thông tin thanh toán!");
                    }
                }
                bill.setStatus(bill.getStatus()+1);
                history.setStatus(bill.getStatus());
            }
        }
        Bill billSave = billRepository.save(bill);
        if(billSave!=null){
            billHistoryRepository.save(history);
        }
        return billSave;
    }

    @Override
    public List<StatisticBillStatus> statisticBillStatus() {
        return billRepository.statisticBillStatus();
    }
}
