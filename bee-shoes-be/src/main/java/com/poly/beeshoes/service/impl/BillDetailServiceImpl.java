package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.converter.BillDetailConvert;
import com.poly.beeshoes.infrastructure.request.BillDetailRequest;
import com.poly.beeshoes.infrastructure.response.BillDetailResponse;
import com.poly.beeshoes.repository.IBillDetailRepository;
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
        return billDetailRepository.save(billDetail);
    }

    @Override
    public BillDetail update(Long id, BillDetailRequest request) {
        BillDetail old = billDetailRepository.findById(id).get();
        if(billDetailRepository.existsByShoeDetailIdAndBillId(
                request.getShoeDetail(), request.getBill()
        )){
            //Mess đã tồn tại và cộng dồn số lượng
        }
        return billDetailRepository.save(billDetailConvert.convertRequestToEntity(old,request));
    }

    @Override
    public BillDetail delete(Long id) {
        return null;
    }
}
