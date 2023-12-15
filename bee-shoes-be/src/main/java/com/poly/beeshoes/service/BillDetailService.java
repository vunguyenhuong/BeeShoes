package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.dto.request.billdetail.BillDetailRequest;
import com.poly.beeshoes.dto.response.BillDetailResponse;

import java.math.BigDecimal;

public interface BillDetailService {
    PageableObject<BillDetailResponse> getAll(BillDetailRequest request);

    BillDetail getOne(Long id);
    BillDetail create(BillDetailRequest request);
    BillDetail update(Long id,BillDetailRequest request);
    BillDetail delete(Long id);

    BillDetail updateQuantity(Long id, Integer newQuantity, BigDecimal price);
}
