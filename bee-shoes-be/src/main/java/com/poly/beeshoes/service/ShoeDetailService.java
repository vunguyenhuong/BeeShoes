package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.request.shoedetail.UpdateShoeDetailRequest;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.shoedetail.ShoeDetailRequest;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.dto.request.shoedetail.FindShoeDetailRequest;
import com.poly.beeshoes.dto.response.ShoeDetailResponse;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface ShoeDetailService {
    PageableObject<ShoeDetailResponse> getAll(FindShoeDetailRequest request);
    ShoeDetail getOne(Long id);
    String create(List<ShoeDetailRequest> list);
    ShoeDetail update(Long id, UpdateShoeDetailRequest request);
    ShoeDetail delete(Long id);

    ResponseObject updateFast(List<ShoeDetailRequest> list);
    Map<String, BigDecimal> findMinAndMaxPrice();
    ShoeDetailResponse getOneShoeDetail(Long id);
}
