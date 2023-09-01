package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.BillRequest;
import com.poly.beeshoes.infrastructure.response.BillResponse;

public interface BillService {
    PageableObject<BillResponse> getAll(BillRequest billRequest);

    Bill getOne(Long id);
    Bill create(BillRequest billRequest);
    Bill update(Long id,BillRequest request);
    Bill delete(Long id);
}
