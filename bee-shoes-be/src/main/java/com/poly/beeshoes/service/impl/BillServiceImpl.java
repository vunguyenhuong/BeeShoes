package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.converter.BillConvert;
import com.poly.beeshoes.infrastructure.request.BillRequest;
import com.poly.beeshoes.infrastructure.response.BillResponse;
import com.poly.beeshoes.repository.IBillRepository;
import com.poly.beeshoes.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BillServiceImpl implements BillService {
    @Autowired
    private IBillRepository billRepository;

    @Autowired
    private BillConvert billConvert;

    @Override
    public PageableObject<BillResponse> getAll(BillRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(billRepository.getAllBill(request, pageable));
    }

    @Override
    public Bill getOne(Long id) {
        return billRepository.findById(id).orElse(null);
    }

    @Override
    public Bill create(BillRequest request) {
        return billRepository.save(billConvert.convertRequestToEntity(request));
    }

    @Override
    public Bill update(Long id, BillRequest request) {
        Bill oldBill = billRepository.findById(id).get();
        return billRepository.save(billConvert.convertRequestToEntity(oldBill, request));
    }

    @Override
    public Bill delete(Long id) {
        return null;
    }

}
