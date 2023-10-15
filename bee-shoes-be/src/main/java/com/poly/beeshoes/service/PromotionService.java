package com.poly.beeshoes.service;

import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.PromotionRequest;
import com.poly.beeshoes.infrastructure.response.PromotionResponse;

public interface PromotionService {
    PageableObject<PromotionResponse> getAll(PromotionRequest request);
}
