package com.poly.beeshoes.service;



import com.poly.beeshoes.entity.Promotion;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.PromotionRequest;
import com.poly.beeshoes.dto.response.PromotionResponse;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PromotionService {
    PageableObject<PromotionResponse> getAll(PromotionRequest request);
    ResponseObject create(PromotionRequest request);
    ResponseObject update(Long id,PromotionRequest request);
    PromotionResponse getOne(Long id);
    List<Long> getListIdShoePromotion(Long idPromotion);
    List<Long> getListIdShoeDetailInPromotion(@Param("idPromotion") Long idPromotion);
    void deleteAll(Long idPromotion);
    void updateStatusPromotion();
    Promotion updateEndDate(Long id);
}
