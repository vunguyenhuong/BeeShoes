package com.poly.beeshoes.service;

import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.BillHistoryRequest;
import com.poly.beeshoes.infrastructure.response.BillHistoryResponse;

import java.util.List;

public interface BillHistoryService {
    List<BillHistoryResponse> getByBill(Long idBill);
    ResponseObject create(BillHistoryRequest request);
}
