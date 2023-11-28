package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.request.CartClientRequest;

public interface CartDetailService {
    Boolean deleteCartDetail(Long id);

    String changeQuantity(CartClientRequest cartClientRequest);
}
