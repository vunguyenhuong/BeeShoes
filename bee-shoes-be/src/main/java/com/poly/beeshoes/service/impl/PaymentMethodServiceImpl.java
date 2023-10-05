package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.infrastructure.response.PaymentMethodResponse;
import com.poly.beeshoes.repository.IPaymentMethodRepository;
import com.poly.beeshoes.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {
    @Autowired
    private IPaymentMethodRepository repository;

    @Override
    public List<PaymentMethodResponse> getByBill(Long idBill) {
        return repository.getByBill(idBill);
    }
}
