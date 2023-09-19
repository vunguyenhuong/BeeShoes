package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.request.bill.BillRequest;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.IVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillConvert {
    @Autowired
    private IAccountRepository accountRepository;

    @Autowired
    private IVoucherRepository voucherRepository;

    @Autowired
    private IBillRepository billRepository;

    public String genBillCode() {
        String prefix = "HD100";
        int x = 1;
        String code = prefix + x;
        while (billRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        System.out.println(code);
        return code;
    }

    public Bill convertRequestToEntity(BillRequest request) {
        return Bill.builder()
                .code(genBillCode())
                .account(accountRepository.findById(request.getAccount()).get())
                .customer(accountRepository.findById(request.getAccount()).get())
                .voucher(voucherRepository.findById(request.getVoucher()).get())
                .type(request.getType())
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .moneyShip(request.getMoneyShip())
                .moneyReduce(request.getMoneyReduce())
                .totalMoney(request.getTotalMoney())
                .payDate(request.getPayDate())
                .shipDate(request.getShipDate())
                .desiredDate(request.getDesiredDate())
                .receiveDate(request.getReceiveDate())
                .status(request.getStatus())
                .build();
    }

    public Bill convertRequestToEntity(Bill entity, BillRequest request) {
        entity.setAccount(accountRepository.findById(request.getAccount()).get());
        entity.setCustomer(accountRepository.findById(request.getAccount()).get());
        entity.setVoucher(voucherRepository.findById(request.getVoucher()).get());
        entity.setType(request.getType());
        entity.setCustomerName(request.getCustomerName());
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setAddress(request.getAddress());
        entity.setMoneyShip(request.getMoneyShip());
        entity.setMoneyReduce(request.getMoneyReduce());
        entity.setTotalMoney(request.getTotalMoney());
        entity.setPayDate(request.getPayDate());
        entity.setShipDate(request.getShipDate());
        entity.setDesiredDate(request.getDesiredDate());
        entity.setReceiveDate(request.getReceiveDate());
        entity.setStatus(request.getStatus());
        return entity;
    }

}
