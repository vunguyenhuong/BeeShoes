package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.converter.PaymentMethodConvert;
import com.poly.beeshoes.dto.request.PaymentMethodRequest;
import com.poly.beeshoes.dto.response.PaymentMethodResponse;
import com.poly.beeshoes.repository.IPaymentMethodRepository;
import com.poly.beeshoes.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
    @Autowired
    private IPaymentMethodRepository repository;
    @Autowired
    private PaymentMethodConvert paymentMethodConvert;

    @Override
    public List<PaymentMethodResponse> getByBill(Long idBill) {
        return repository.getByBill(idBill);
    }

    @Override
    public ResponseObject create(PaymentMethodRequest request) {
        return new ResponseObject(repository.save(paymentMethodConvert.convertRequestToEntity(request)));
    }
}
