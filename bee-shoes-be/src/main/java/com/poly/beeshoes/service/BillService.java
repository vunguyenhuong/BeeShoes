package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.BillClientRequest;
import com.poly.beeshoes.infrastructure.request.bill.BillRequest;
import com.poly.beeshoes.infrastructure.request.bill.BillSearchRequest;
import com.poly.beeshoes.infrastructure.response.BillResponse;

public interface BillService {
    PageableObject<BillResponse> getAll(BillSearchRequest request);
    Bill getOne(Long id);
    Bill create();
    Bill update(Long id,BillRequest request);
    ResponseObject createBillClient(BillClientRequest request);
    Bill delete(Long id);
    Bill changeStatus(Long id, String status);
}
