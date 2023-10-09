package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.BillDetailRequest;
import com.poly.beeshoes.infrastructure.response.BillDetailResponse;

public interface BillDetailService {
    PageableObject<BillDetailResponse> getAll(BillDetailRequest request);

    BillDetail getOne(Long id);
    BillDetail create(BillDetailRequest request);
    BillDetail update(Long id,BillDetailRequest request);
    BillDetail delete(Long id);

    BillDetail updateQuantity(Long id, Integer newQuantity);
}
