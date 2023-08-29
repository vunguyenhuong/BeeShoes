package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.infrastructure.request.ShoeRequest;
import com.poly.beeshoes.infrastructure.response.ShoeResponse;
import com.poly.beeshoes.infrastructure.common.PageableObject;

public interface ShoeService {
    PageableObject<ShoeResponse> getAll(ShoeRequest request);
    Shoe getOne(Long id);
    Shoe create(ShoeRequest request);
    Shoe update(Long id,ShoeRequest request);
    Shoe delete(Long id);
}
