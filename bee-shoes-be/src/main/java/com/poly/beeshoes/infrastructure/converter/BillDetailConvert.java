package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.entity.PromotionDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.dto.request.billdetail.BillDetailRequest;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.IPromotionDetailRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillDetailConvert {
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private IPromotionDetailRepository promotionDetailRepository;

    public BillDetail convertRequestToEntity(BillDetailRequest request) {
        ShoeDetail shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill()).get();
        PromotionDetail promotionDetail = promotionDetailRepository.findByShoeDetailCode(request.getShoeDetail());
        return BillDetail.builder()
                .shoeDetail(shoeDetail)
                .bill(bill)
                .price(promotionDetail != null ? promotionDetail.getPromotionPrice() : shoeDetail.getPrice())
                .quantity(request.getQuantity())
                .status(false)
                .build();
    }

    public BillDetail convertRequestToEntity(BillDetail entity, BillDetailRequest request) {
        ShoeDetail shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill()).get();
        PromotionDetail promotionDetail = promotionDetailRepository.findByShoeDetailCode(request.getCode());
        entity.setShoeDetail(shoeDetail);
        entity.setBill(bill);
        entity.setPrice(promotionDetail != null ? promotionDetail.getPromotionPrice() : shoeDetail.getPrice());
        entity.setQuantity(entity.getQuantity() + request.getQuantity());
        return entity;
    }
}
