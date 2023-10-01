package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.converter.BillDetailConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.request.BillDetailRequest;
import com.poly.beeshoes.infrastructure.response.BillDetailResponse;
import com.poly.beeshoes.repository.IBillDetailRepository;
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
            existBillDetail.setPrice(shoeDetail.getPrice());
            existBillDetail.setQuantity(existBillDetail.getQuantity()+request.getQuantity());
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
        return null;
    }
}
