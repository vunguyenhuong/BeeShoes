package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.request.VoucherRequest;
import com.poly.beeshoes.dto.response.VoucherResponse;
import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.entity.AccountVoucher;
import com.poly.beeshoes.entity.Notification;
import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.infrastructure.common.FormatCommon;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.constant.NotificationType;
import com.poly.beeshoes.infrastructure.converter.VoucherConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.IAccountVoucherRepository;
import com.poly.beeshoes.repository.INotificationRepository;
import com.poly.beeshoes.repository.IVoucherRepository;
import com.poly.beeshoes.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class VoucherServiceImpl implements VoucherService {
    @Autowired
    private IVoucherRepository voucherRepository;
    @Autowired
    private IAccountRepository accountRepository;
    @Autowired
    private IAccountVoucherRepository accountVoucherRepository;
    @Autowired
    private INotificationRepository notificationRepository;
    @Autowired
    private VoucherConvert voucherConvert;

    private String genCode() {
        String prefix = "VBS0";
        int x = 1;
        String code = prefix + x;
        while (voucherRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }

    @Override
    public List<VoucherResponse> getAccountVoucher(Long id, VoucherRequest request) {
        return voucherRepository.getAccountVoucher(id, request);
    }

    @Override
    public List<VoucherResponse> getPublicVoucher(VoucherRequest request) {
        return voucherRepository.getPublicVoucher(request);
    }

    @Override
    public PageableObject<VoucherResponse> getAll(VoucherRequest request) {
        return new PageableObject<>(voucherRepository.getAllVoucher(request, PageRequest.of(request.getPage() - 1 > 0 ? request.getPage() - 1 : 0, request.getSizePage())));
    }

    @Override
    public VoucherResponse getOne(Long id) {
        for (Voucher voucher : voucherRepository.findAll()) {
            updateStatus(voucher);
        }
        return voucherRepository.getOneVoucher(id);
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public Voucher add(VoucherRequest request) {
        if (request.getName().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getQuantity() <= 0) {
            throw new RestApiException("Số lượng phải lớn hơn 0.");
        }
        if (request.getQuantity() <= 0 || request.getQuantity() != (int) request.getQuantity() || request.getQuantity() == null) {
            throw new RestApiException("Số lượng phải là số nguyên dương.");
        }
        if(request.getQuantity()>10000){
            throw new RestApiException("Số lượng không được vượt quá 10000. ");
        }
        try {
            float percentReduce = Float.valueOf(request.getPercentReduce());
            if (percentReduce < 0 || percentReduce > 50) {
                throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
            }
        } catch (NumberFormatException e) {
            throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
        } catch (RestApiException e) {
            throw e;
        }

        if (Float.valueOf(request.getPercentReduce()) <= 0) {
            throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
        }
        if (request.getMinBillValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getStartDate().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
        }
        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }
        request.setCode(genCode());
        Voucher voucher = voucherConvert.converRequestToEntity(request);
        Voucher voucherSave = voucherRepository.save(voucher);
        updateStatus(voucherSave);
        System.out.println(request);
        if (!voucherSave.getType()) {
            if (!request.getCustomers().isEmpty()) {
                request.getCustomers().forEach(customerId -> {
                    AccountVoucher accountVoucher = new AccountVoucher();
                    Account account = accountRepository.findById(customerId).get();
                    accountVoucher.setVoucher(voucherSave);
                    accountVoucher.setAccount(account);
                    accountVoucherRepository.save(accountVoucher);

                    Notification notification = new Notification();
                    notification.setAccount(account);
                    notification.setTitle("Phiếu giảm giá dành riêng cho bạn [" + voucher.getCode() + "]");
                    notification.setContent("Bạn vừa nhận được phiếu giảm giá giảm " +
                            voucher.getPercentReduce() + "% cho đơn hàng từ " +
                            FormatCommon.convertCurrency(voucher.getMinBillValue().doubleValue()) + "" +
                            "##Ngày bắt đầu: " + FormatCommon.formatDate(voucher.getStartDate()) +
                            "##Ngày hết hạn: " + FormatCommon.formatDate(voucher.getEndDate()));
                    notification.setType(NotificationType.CHUA_DOC);
                    notificationRepository.save(notification);
                });
            }
        }
        return voucher;

    }

    @Override
    public Voucher update(Long id, VoucherRequest request) {
        Voucher voucherToUpdate = voucherRepository.findById(id).orElse(null);
        if (request.getName().length() > 50) {
            throw new RestApiException("Tên phiếu giảm giá không được vượt quá 50 kí tự.");
        }
        if (request.getQuantity() <= 0) {
            throw new RestApiException("Số lượng phải lớn hơn 0. ");
        }
        if(request.getQuantity()>10000){
            throw new RestApiException("Số lượng không được vượt quá 10000. ");
        }
        if (request.getQuantity() <= 0 || request.getQuantity() != (int) request.getQuantity() || request.getQuantity() == null) {
            throw new RestApiException("Số lượng phải là số nguyên dương.");
        }
        if (Float.valueOf(request.getPercentReduce()) < 0 || Float.valueOf(request.getPercentReduce()) > 50) {
            throw new RestApiException("Phần trăm giảm phải nằm trong khoảng từ 1 đến 50. ");
        }
        if (!String.valueOf(request.getPercentReduce()).matches("^-?\\d+(\\.\\d+)?$")) {
//            System.out.println("1212");
            throw new RestApiException("Phần trăm giảm phải là số");
        }
        if (request.getMinBillValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new RestApiException("Đơn tối thiểu phải lớn hơn hoặc bằng 0. ");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        Voucher voucherSave = voucherRepository.save(voucherConvert.convertRequestToEntity(id, request));
        if (voucherSave != null) {
            updateStatus(voucherToUpdate);
        }
        if (!voucherSave.getType()) {
            if (!request.getCustomers().isEmpty()) {
                accountVoucherRepository.deleteAll(accountVoucherRepository.findByVoucherId(voucherSave.getId()));
                request.getCustomers().forEach(customerId -> {
                    AccountVoucher accountVoucher = new AccountVoucher();
                    Account account = accountRepository.findById(customerId).get();
                    accountVoucher.setVoucher(voucherSave);
                    accountVoucher.setAccount(account);
                    accountVoucherRepository.save(accountVoucher);

                    Notification notification = new Notification();
                    notification.setAccount(account);
                    notification.setTitle("Phiếu giảm giá dành riêng cho bạn [" + voucherSave.getCode() + "]");
                    notification.setContent("Bạn vừa nhận được phiếu giảm giá giảm " +
                            voucherSave.getPercentReduce() + "% cho đơn hàng từ " +
                            FormatCommon.convertCurrency(voucherSave.getMinBillValue().doubleValue()) + "" +
                            "##Ngày bắt đầu: " + FormatCommon.formatDate(voucherSave.getStartDate()) +
                            "##Ngày hết hạn: " + FormatCommon.formatDate(voucherSave.getEndDate()));
                    notification.setType(NotificationType.CHUA_DOC);
                    notificationRepository.save(notification);
                });
            }
        } else {
            accountVoucherRepository.deleteAll(accountVoucherRepository.findByVoucherId(voucherSave.getId()));
        }
        return voucherSave;
    }


    @Override
    public String delete(Long id) {
        voucherRepository.deleteById(id);
        return "Xóa oke";
    }

    @Override
    public boolean isVoucherCodeExists(String code) {
        return voucherRepository.existsByCode(code);
    }

    public void updateStatusVoucher() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findAll();
        for (Voucher voucher : vouchers) {
            LocalDateTime startDate = voucher.getStartDate();
            LocalDateTime endDate = voucher.getEndDate();
            // so luong bang 0 thi se ket thuc voucher som
            if (voucher.getQuantity() == 0) {
                voucher.setStatus(2); // Đã kết thúc
//                voucher.setEndDate(currentDateTime);
            } else {
                if (voucher.getQuantity() > 0) {
                    voucher.setStatus(1); // Đang diễn ra
                }
                if (currentDateTime.isBefore(startDate)) {
                    voucher.setStatus(0); // Chưa bắt đầu
                } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                    voucher.setStatus(1); // Đang diễn ra
                } else {
                    voucher.setStatus(2); // Đã kết thúc
//                voucher.setDeleted(true);
                }


                if (endDate.isEqual(startDate)) {
                    voucher.setStatus(2); // Đã kết thúc
//                voucher.setDeleted(true);
                }
            }
            voucherRepository.save(voucher);
        }
    }

    @Override
    public Voucher updateEndDate(Long id) {
        Voucher voucherToUpdate = voucherRepository.findById(id).orElse(null);
        LocalDateTime currentDate = LocalDateTime.now();
        if(voucherToUpdate.getStatus()==2) {
            throw new RestApiException("Phiếu giảm giá này đã kết thúc rồi!");
        }
        if(voucherToUpdate.getStatus()==0){
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            voucherToUpdate.setStartDate(startDate);
        }
        voucherToUpdate.setEndDate(currentDate);
        voucherToUpdate.setStatus(2); // Đã kết thúc
        return voucherRepository.save(voucherToUpdate);

    }


    public void updateStatus(Voucher voucher) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime startDate = voucher.getStartDate();
        LocalDateTime endDate = voucher.getEndDate();
        if (currentDate.isBefore(startDate)) {
            voucher.setStatus(0); // Chưa bắt đầu
        } else if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
            voucher.setStatus(1); // Đang diễn ra
//            voucher.setDeleted(null);
        } else {
            voucher.setStatus(2); // Đã kết thúc
//            voucher.setDeleted(true);
        }
        voucherRepository.save(voucher);
    }

    public void createScheduledVoucher() {
        // Lấy ngày hiện tại
        LocalDateTime currentDateTime = LocalDateTime.now();
        // set name voucher theo ngày tạo
        String voucherName = "Phiếu giảm giá ngày " + currentDateTime.format(DateTimeFormatter.ofPattern("dd/MM"));
        // Đặt startDate vào 00:00:00 của ngày hiện tại
        LocalDateTime startDate = currentDateTime.with(LocalTime.MIN);
        // Đặt endDate vào 23:59:59 của ngày hiện tại
        LocalDateTime endDate = currentDateTime.with(LocalTime.MAX);
        // logic
        Voucher voucher = new Voucher();
        voucher.setCode(genCode());
        voucher.setName(voucherName);
        voucher.setStartDate(startDate);
        voucher.setEndDate(endDate);
        voucher.setMinBillValue(BigDecimal.valueOf(10000));
        voucher.setPercentReduce(Float.valueOf(5));
        voucher.setQuantity(100);
        updateStatus(voucher);
    }

    private boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
