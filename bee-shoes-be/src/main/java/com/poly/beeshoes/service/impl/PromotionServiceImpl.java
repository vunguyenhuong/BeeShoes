package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Promotion;
import com.poly.beeshoes.entity.PromotionDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.PromotionRequest;
import com.poly.beeshoes.infrastructure.response.PromotionResponse;
import com.poly.beeshoes.repository.IPromotionDetailRepository;
import com.poly.beeshoes.repository.IPromotionRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PromotionServiceImpl implements PromotionService {
    @Autowired
    private IPromotionRepository iPromotionRepository;
    @Autowired
    private IPromotionDetailRepository promotionDetailRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Override
    public PageableObject<PromotionResponse> getAll(PromotionRequest request) {
        return new PageableObject<>(iPromotionRepository.getAllPromotion(request, PageRequest.of(request.getPage()-1,request.getSizePage())));
    }

    @Override
    @Transactional
    public ResponseObject create(PromotionRequest request) {
        Promotion promotion = new Promotion();
        promotion.setCode(request.getCode());
        promotion.setName(request.getName());
        promotion.setValue(request.getValue());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        Promotion promotionSave = iPromotionRepository.save(promotion);
        if(promotionSave!=null){
            for (Long x: request.getProductDetails()) {
                if(!promotionDetailRepository.existsByShoeDetailId(x)){
                    ShoeDetail shoeDetail = shoeDetailRepository.findById(x).get();
                    PromotionDetail promotionDetail = new PromotionDetail();
                    promotionDetail.setPromotion(promotionSave);
                    promotionDetail.setShoeDetail(shoeDetail);
                    promotionDetail.setPromotionPrice(shoeDetail.getPrice().multiply(request.getValue()));
                    promotionDetailRepository.save(promotionDetail);
                }
            }
        }
        return new ResponseObject("ABC");
    }

    @Override
    public PromotionResponse getOne(Long id) {
        return iPromotionRepository.getOnePromotion(id);
    }
}
