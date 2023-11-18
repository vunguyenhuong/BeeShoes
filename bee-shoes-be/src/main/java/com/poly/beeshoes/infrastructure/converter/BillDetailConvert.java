package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.dto.request.billdetail.BillDetailRequest;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillDetailConvert {
    @Autowired
    private IBillRepository billRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;

    public BillDetail convertRequestToEntity(BillDetailRequest request) {
        ShoeDetail shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill()).get();
        return BillDetail.builder()
                .shoeDetail(shoeDetail)
                .bill(bill)
                .price(shoeDetail.getPrice())
                .quantity(request.getQuantity())
                .build();
    }

    public BillDetail convertRequestToEntity(BillDetail entity, BillDetailRequest request) {
        ShoeDetail shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        Bill bill = billRepository.findById(request.getBill()).get();

        entity.setShoeDetail(shoeDetail);
        entity.setBill(bill);
        entity.setPrice(request.getPrice());
        entity.setQuantity(entity.getQuantity() + request.getQuantity());
        return entity;
    }
}
