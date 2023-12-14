package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.dto.request.VoucherRequest;
import com.poly.beeshoes.repository.IVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class VoucherConvert {
    @Autowired
    private IVoucherRepository voucherRepository;

    public Voucher converRequestToEntity(VoucherRequest request){
        return Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .quantity(request.getQuantity())
                .percentReduce(Float.valueOf(request.getPercentReduce()))
                .minBillValue(new BigDecimal(request.getMinBillValue().toString()))
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .type(request.getType())
                .build();
    }
    public Voucher convertRequestToEntity(Long id, VoucherRequest request){
        Voucher voucher = voucherRepository.findById(id).get();
        voucher.setName(request.getName());
        voucher.setQuantity(request.getQuantity());
        voucher.setPercentReduce(Float.valueOf(request.getPercentReduce()));
        voucher.setMinBillValue(new BigDecimal(request.getMinBillValue().toString()));
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setType(request.getType());
        return voucher;
    }

}
