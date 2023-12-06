package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.entity.PromotionDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.converter.BillDetailConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.dto.request.billdetail.BillDetailRequest;
import com.poly.beeshoes.dto.response.BillDetailResponse;
import com.poly.beeshoes.repository.IBillDetailRepository;
import com.poly.beeshoes.repository.IPromotionDetailRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.service.BillDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    private IBillDetailRepository billDetailRepository;
    @Autowired
    private BillDetailConvert billDetailConvert;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private IPromotionDetailRepository promotionDetailRepository;

    @Override
    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(billDetailRepository.getAllBillDetail(request, pageable));
    }

    @Override
    public BillDetail getOne(Long id) {
        return billDetailRepository.findById(id).orElse(null);
    }

    @Override
    public BillDetail create(BillDetailRequest request) {
        PromotionDetail promotionDetail = promotionDetailRepository.findByShoeDetailCode(request.getShoeDetail());
        BillDetail billDetail = billDetailConvert.convertRequestToEntity(request);
        ShoeDetail shoeDetail = shoeDetailRepository.findByCode(request.getShoeDetail());
        if(request.getQuantity() < 1){
            throw new RestApiException("Số lượng phải lớn hơn 1!");
        } else if (request.getQuantity() > shoeDetail.getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        shoeDetail.setQuantity(shoeDetail.getQuantity()-request.getQuantity());
        shoeDetailRepository.save(shoeDetail);
        BillDetail existBillDetail = billDetailRepository.findByShoeDetailCodeAndBillId(request.getShoeDetail(), request.getBill());
        if(existBillDetail != null){
            existBillDetail.setPrice(promotionDetail != null ? promotionDetail.getPromotionPrice() : shoeDetail.getPrice());
            existBillDetail.setQuantity(existBillDetail.getQuantity()+request.getQuantity());
            existBillDetail.setStatus(true);
            return billDetailRepository.save(existBillDetail);
        }
        return billDetailRepository.save(billDetail);
    }

    @Override
    public BillDetail update(Long id, BillDetailRequest request) {
        BillDetail old = billDetailRepository.findById(id).get();
        return billDetailRepository.save(billDetailConvert.convertRequestToEntity(old,request));
    }

    @Override
    public BillDetail delete(Long id) {
        BillDetail billDetail = billDetailRepository.findById(id).get();
        ShoeDetail shoeDetail = billDetail.getShoeDetail();
        shoeDetail.setQuantity(shoeDetail.getQuantity()+billDetail.getQuantity());
        billDetailRepository.delete(billDetail);
        return billDetail;
    }

    @Override
    public BillDetail updateQuantity(Long id, Integer newQuantity) {
        BillDetail billDetail = billDetailRepository.findById(id).get();
        ShoeDetail shoeDetail = billDetail.getShoeDetail();
        if(newQuantity > (shoeDetail.getQuantity()+billDetail.getQuantity())){
            throw new RestApiException("Quá số lượng cho phép!");
        }
        if(newQuantity <= 0){
            throw new RestApiException("Vui lòng nhập số lượng hợp lệ!");
        }
        shoeDetail.setQuantity(shoeDetail.getQuantity()+billDetail.getQuantity()-newQuantity);
        billDetail.setQuantity(newQuantity);
        billDetailRepository.save(billDetail);
        shoeDetailRepository.save(shoeDetail);
        return billDetail;
    }
}
