package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Promotion;
import com.poly.beeshoes.entity.PromotionDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.entity.Voucher;
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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
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
        if (request.getCode().length() > 20) {
            throw new RestApiException("Mã đợt giảm giá không được vượt quá 20 kí tự.");
        }
        if (!isCodeUnique(request.getCode())) {
            throw new RestApiException("Mã đợt giảm giá đã tồn tại");
        }
        if (request.getName().length() > 50) {
            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }
        if(request.getValue() < 1 || request.getValue() >50){
            throw new RestApiException("Vui lòng nhập giá trị (%) hợp lệ!");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }
        if (request.getStartDate().isBefore(LocalDateTime.now(ZoneOffset.UTC))) {
            throw new RestApiException("Ngày bắt đầu phải từ ngày hiện tại trở đi.");
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
        updateStatusPromotion();
        return new ResponseObject(request);
    }

    @Override
    @Transactional(rollbackFor = RestApiException.class)
    public ResponseObject update(Long id, PromotionRequest request) {
        deleteAll(id);
        Promotion promotion = promotionRepository.findById(id).get();

        if (request.getCode().length() > 20) {
            throw new RestApiException("Mã đợt giảm giá không được vượt quá 20 kí tự.");
        }

        if(!promotion.getCode().equalsIgnoreCase(request.getCode())){
            if (!isCodeUnique(request.getCode())) {
                throw new RestApiException("Mã đợt giảm giá đã tồn tại");
            }
        }
        if (request.getName().length() > 50) {
            throw new RestApiException("Tên đợt giảm giá không được vượt quá 50 kí tự.");
        }
        if(request.getValue() < 1 || request.getValue() >50){
            throw new RestApiException("Vui lòng nhập giá trị (%) hợp lệ!");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RestApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        }
        if (request.getStartDate().isEqual(request.getEndDate())) {
            throw new RestApiException("Ngày giờ bắt đầu không được trùng với ngày giờ kết thúc.");
        }


        Promotion promotionSave = promotionRepository.save(promotionConvert.convertRequestToEntity(promotion, request));
        for (Long x: request.getProductDetails()) {
            PromotionDetail check = promotionDetailRepository.findByShoeDetailId(x);
            if(check != null) {
                updateStatus(promotion);
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
    public void updateStatus(Promotion promotion) {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime startDate = promotion.getStartDate();
        LocalDateTime endDate = promotion.getEndDate();
        if (currentDate.isBefore(startDate)) {
            promotion.setStatus(0); // Chưa bắt đầu
        } else if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
            promotion.setStatus(1); // Đang diễn ra
        } else {
            promotion.setStatus(2); // Đã kết thúc
//            promotion.setDeleted(true);
        }
        promotionRepository.save(promotion);
    }

    public void updateStatusPromotion() {
        LocalDateTime currentDateTime = LocalDateTime.now();
        List<Promotion> promotions = promotionRepository.findAll();
        for (Promotion promotion : promotions) {
            LocalDateTime startDate = promotion.getStartDate();
            LocalDateTime endDate = promotion.getEndDate();
            if (currentDateTime.isBefore(startDate)) {
                promotion.setStatus(0); // Chưa bắt đầu
            } else if (currentDateTime.isAfter(startDate) && currentDateTime.isBefore(endDate)) {
                promotion.setStatus(1); // Đang diễn ra
//                promotion.setDeleted(null);
            } else {
                promotion.setStatus(2); // Đã kết thúc
//                promotion.setDeleted(true);
            }
            if (endDate.isEqual(startDate)) {
                promotion.setStatus(2); // Đã kết thúc
//                promotion.setDeleted(true);
            }
            promotionRepository.save(promotion);
        }
    }

    @Override
    public Promotion updateEndDate(Long id) {
        Promotion promotionToUpdate = promotionRepository.findById(id).orElse(null);
        LocalDateTime currentDate = LocalDateTime.now();
        if(promotionToUpdate.getStatus()==2) {
            throw new RestApiException("Đợt giảm giá này đã kết thúc rồi!");
        }
        if(promotionToUpdate.getStatus()==0){
            LocalDateTime startDate = currentDate.with(LocalTime.MIN);
            promotionToUpdate.setStartDate(startDate);
        }
        promotionToUpdate.setEndDate(currentDate);
        promotionToUpdate.setStatus(2); // Đã kết thúc
        return promotionRepository.save(promotionToUpdate);
    }

    public boolean isCodeUnique(String code) {
        Optional<Promotion> existingPromotion = promotionRepository.findByCode(code);
        return existingPromotion.isEmpty();
    }

}
