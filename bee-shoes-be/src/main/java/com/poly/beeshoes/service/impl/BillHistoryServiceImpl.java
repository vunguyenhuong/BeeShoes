package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.converter.BillHistoryConvert;
import com.poly.beeshoes.dto.request.BillHistoryRequest;
import com.poly.beeshoes.dto.response.BillHistoryResponse;
import com.poly.beeshoes.repository.IBillHistoryRepository;
import com.poly.beeshoes.service.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillHistoryServiceImpl implements BillHistoryService {
    @Autowired
    private IBillHistoryRepository repository;
    @Autowired
    private BillHistoryConvert billHistoryConvert;

    @Override
    public List<BillHistoryResponse> getByBill(Long idBill) {
        return repository.getByBill(idBill);
    }

    @Override
    public ResponseObject create(BillHistoryRequest request) {
        return new ResponseObject(billHistoryConvert.convertRequestToEntity(request));
    }
}
