package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.BillHistory;
import com.poly.beeshoes.dto.request.BillHistoryRequest;
import com.poly.beeshoes.repository.IBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BillHistoryConvert {
    @Autowired
    private IBillRepository billRepository;

    public BillHistory convertRequestToEntity(BillHistoryRequest request) {
        return BillHistory.builder()
                .bill(billRepository.findById(request.getIdBill()).get())
                .note(request.getNote())
                .status(request.getStatus())
                .build();
    }
}
