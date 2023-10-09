package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.PaymentMethod;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.PaymentMethodRequest;
import com.poly.beeshoes.infrastructure.response.PaymentMethodResponse;

import java.util.List;

public interface PaymentMethodService {
    List<PaymentMethodResponse> getByBill(Long idBill);
    ResponseObject create(PaymentMethodRequest request);
}
