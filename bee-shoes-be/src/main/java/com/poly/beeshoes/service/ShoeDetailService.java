package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.request.ShoeDetailRequest;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.response.ShoeDetailResponse;

import java.util.List;

public interface ShoeDetailService {
    PageableObject<ShoeDetailResponse> getAll(ShoeDetailRequest request);
    ShoeDetail getOne(Long id);
    String create(List<ShoeDetailRequest> list);
    ShoeDetail update(Long id, ShoeDetailRequest request);
    ShoeDetail delete(Long id);
}
