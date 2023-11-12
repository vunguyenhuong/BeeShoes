package com.poly.beeshoes.service;

import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.PromotionRequest;
import com.poly.beeshoes.infrastructure.response.PromotionResponse;

public interface PromotionService {
    PageableObject<PromotionResponse> getAll(PromotionRequest request);
    ResponseObject create(PromotionRequest request);
    PromotionResponse getOne(Long id);
}
