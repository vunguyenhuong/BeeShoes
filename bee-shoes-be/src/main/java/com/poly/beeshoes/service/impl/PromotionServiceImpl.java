package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Promotion;
import com.poly.beeshoes.entity.PromotionDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.PromotionRequest;
import com.poly.beeshoes.dto.response.PromotionResponse;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.repository.IPromotionDetailRepository;
import com.poly.beeshoes.repository.IPromotionRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject create(PromotionRequest request) {
        Promotion promotion = new Promotion();
        promotion.setCode(request.getCode());
        promotion.setName(request.getName());
        if(request.getValue() <= 0 || request.getValue() >= 100){
            throw new RestApiException("Vui lòng nhập giá trị hợp lệ!");
        }
        promotion.setValue(request.getValue());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        Promotion promotionSave = iPromotionRepository.save(promotion);
        for (Long x: request.getProductDetails()) {
            ShoeDetail shoeDetail = shoeDetailRepository.findById(x).get();
            if(!promotionDetailRepository.existsByShoeDetailId(x)){
                PromotionDetail promotionDetail = new PromotionDetail();
                promotionDetail.setPromotion(promotionSave);
                promotionDetail.setShoeDetail(shoeDetail);
                promotionDetail.setPromotionPrice(shoeDetail.getPrice().subtract((shoeDetail.getPrice().divide(new BigDecimal("100"))).multiply(new BigDecimal(request.getValue()))));
                promotionDetailRepository.save(promotionDetail);
            }else {
                throw new RestApiException(
                        shoeDetail.getShoe().getName() + " [" + shoeDetail.getColor().getName() + "-" + shoeDetail.getSize().getName() + "] đã được áp dụng khuyến mại!");
            }
        }
        return new ResponseObject(request);
    }

    @Override
    public PromotionResponse getOne(Long id) {
        return iPromotionRepository.getOnePromotion(id);
    }

    @Override
    public List<Long> getListIdShoePromotion(Long idPromotion) {
        return promotionDetailRepository.getListIdShoePromotion(idPromotion).stream()
                .flatMap(ids -> Arrays.stream(ids.split(",")))
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }

    @Override
    public List<Long> getListIdShoeDetailInPromotion(Long idPromotion) {
        return promotionDetailRepository.getListIdShoeDetailInPromotion(idPromotion).stream()
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAll(Long idPromotion) {
        promotionDetailRepository.deleteAllById(promotionDetailRepository.findIdsByPromotionId(idPromotion));
    }
}
