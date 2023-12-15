package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.request.shoe.FindShoeReqeust;
import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.dto.request.shoe.ShoeRequest;
import com.poly.beeshoes.dto.response.ShoeResponse;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.dto.response.promotion.ShoePromotionResponse;

import java.util.List;

public interface ShoeService {
    PageableObject<ShoeResponse> getAll(FindShoeReqeust request);
    Shoe getOne(Long id);
    Shoe create(ShoeRequest request);
    Shoe update(Long id,ShoeRequest request);
    Shoe changeStatus(Long id);

    List<ShoePromotionResponse> getAllShoeInPromotion(Long promotion);
    List<ShoeResponse> getTopSell(Integer top);
}
