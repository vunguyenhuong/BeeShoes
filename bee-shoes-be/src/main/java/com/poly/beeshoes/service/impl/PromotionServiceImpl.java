package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.PromotionRequest;
import com.poly.beeshoes.infrastructure.response.PromotionResponse;
import com.poly.beeshoes.repository.IPromotionRepository;
import com.poly.beeshoes.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class PromotionServiceImpl implements PromotionService {
    @Autowired
    private IPromotionRepository iPromotionRepository;

    @Override
    public PageableObject<PromotionResponse> getAll(PromotionRequest request) {
        return new PageableObject<>(iPromotionRepository.getAllPromotion(request, PageRequest.of(request.getPage()-1,request.getSizePage())));
    }
}
