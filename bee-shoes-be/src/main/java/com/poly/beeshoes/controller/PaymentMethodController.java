package com.poly.beeshoes.controller;

import com.poly.beeshoes.infrastructure.response.PaymentMethodResponse;
import com.poly.beeshoes.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment-method")
public class PaymentMethodController {
    @Autowired
    private PaymentMethodService service;
    @GetMapping("/{id}")
    public List<PaymentMethodResponse> getAll(@PathVariable Long id){
        return service.getByBill(id);
    }
}
