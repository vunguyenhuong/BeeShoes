package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.request.CartClientRequest;
import com.poly.beeshoes.dto.response.CartResponse;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartService {
    List<CartResponse> getListCart(Long idAccount);
    ResponseObject create(CartClientRequest request);
    ResponseObject updateQuantity(CartClientRequest request);
    ResponseObject deleteById(Long idCartDetail);
    ResponseObject deleteAll(Long idAccount);
}
