package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Promotion;
import com.poly.beeshoes.entity.PromotionDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.PromotionRequest;
import com.poly.beeshoes.dto.response.PromotionResponse;
import com.poly.beeshoes.infrastructure.converter.PromotionConvert;
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
    private IPromotionRepository promotionRepository;
    @Autowired
    private IPromotionDetailRepository promotionDetailRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private PromotionConvert promotionConvert;
    @Override
    public PageableObject<PromotionResponse> getAll(PromotionRequest request) {
        return new PageableObject<>(promotionRepository.getAllPromotion(request, PageRequest.of(request.getPage()-1,request.getSizePage())));
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject create(PromotionRequest request) {
        if(request.getValue() <= 0 || request.getValue() >= 100){
            throw new RestApiException("Vui lòng nhập giá trị hợp lệ!");
        }
        Promotion promotionSave = promotionRepository.save(promotionConvert.convertRequestToEntity(request));
        for (Long x: request.getProductDetails()) {
            PromotionDetail check = promotionDetailRepository.findByShoeDetailId(x);
            if(check != null) {
                promotionDetailRepository.delete(check);
            }
        }
        for (Long x: request.getProductDetails()) {
            ShoeDetail shoeDetail = shoeDetailRepository.findById(x).get();
            PromotionDetail promotionDetail = new PromotionDetail();
            promotionDetail.setPromotion(promotionSave);
            promotionDetail.setShoeDetail(shoeDetail);
            promotionDetail.setPromotionPrice(shoeDetail.getPrice().subtract((shoeDetail.getPrice().divide(new BigDecimal("100"))).multiply(new BigDecimal(request.getValue()))));
            promotionDetailRepository.save(promotionDetail);
        }
        return new ResponseObject(request);
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject update(Long id, PromotionRequest request) {
        deleteAll(id);
        Promotion promotion = promotionRepository.findById(id).get();
        if(request.getValue() <= 0 || request.getValue() >= 100){
            throw new RestApiException("Vui lòng nhập giá trị hợp lệ!");
        }

        Promotion promotionSave = promotionRepository.save(promotionConvert.convertRequestToEntity(promotion, request));
        for (Long x: request.getProductDetails()) {
            PromotionDetail check = promotionDetailRepository.findByShoeDetailId(x);
            if(check != null) {
                promotionDetailRepository.delete(check);
            }
        }
        for (Long x: request.getProductDetails()) {
            ShoeDetail shoeDetail = shoeDetailRepository.findById(x).get();
            PromotionDetail promotionDetail = new PromotionDetail();
            promotionDetail.setPromotion(promotionSave);
            promotionDetail.setShoeDetail(shoeDetail);
            promotionDetail.setPromotionPrice(shoeDetail.getPrice().subtract((shoeDetail.getPrice().divide(new BigDecimal("100"))).multiply(new BigDecimal(request.getValue()))));
            promotionDetailRepository.save(promotionDetail);
        }
        return new ResponseObject(promotion);
    }

    @Override
    public PromotionResponse getOne(Long id) {
        return promotionRepository.getOnePromotion(id);
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
