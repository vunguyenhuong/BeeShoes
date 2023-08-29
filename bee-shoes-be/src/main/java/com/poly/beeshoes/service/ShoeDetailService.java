package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.request.ShoeDetailRequest;
import com.poly.beeshoes.infrastructure.common.PageableObject;

public interface ShoeDetailService {
    PageableObject<ShoeDetail> getAll(ShoeDetailRequest request);
    ShoeDetail getOne(Long id);
    ShoeDetail create(ShoeDetailRequest request);
    ShoeDetail update(Long id, ShoeDetailRequest request);
    ShoeDetail delete(Long id);
}
