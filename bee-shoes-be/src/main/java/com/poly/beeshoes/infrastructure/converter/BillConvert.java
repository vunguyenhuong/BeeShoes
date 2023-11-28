package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.dto.request.bill.BillRequest;
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

    public Bill convertRequestToEntity(Bill entity, BillRequest request) {
        if(request.getVoucher() != null){
            entity.setVoucher(voucherRepository.findById(request.getVoucher()).get());
            System.out.println(request.getVoucher());
        }
        if(request.getCustomer() != null){
            entity.setCustomer(accountRepository.findById(request.getCustomer()).get());
        }
        entity.setCustomerName(request.getCustomerName());
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setAddress(request.getAddress());
        entity.setMoneyShip(request.getMoneyShip());
        entity.setMoneyReduce(request.getMoneyReduce());
        entity.setTotalMoney(request.getTotalMoney().subtract(request.getMoneyReduce()));
        entity.setNote(request.getNote());
        entity.setStatus(request.getStatus());
        entity.setType(request.getType());
        return entity;
    }

}
