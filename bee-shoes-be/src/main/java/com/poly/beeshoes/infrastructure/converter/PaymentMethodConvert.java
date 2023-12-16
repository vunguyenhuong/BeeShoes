package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.PaymentMethod;
import com.poly.beeshoes.dto.request.PaymentMethodRequest;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.IPaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PaymentMethodConvert {
    @Autowired
    private IPaymentMethodRepository repository;
    @Autowired
    private IBillRepository billRepository;
    public PaymentMethod convertRequestToEntity(PaymentMethodRequest request){
        return PaymentMethod.builder()
                .method(request.getMethod())
                .totalMoney(request.getTotalMoney())
                .note(request.getNote())
                .tradingCode(request.getTradingCode())
                .bill(billRepository.findById(request.getBill()).orElse(null))
                .type(request.getType())
                .build();
    }
}
