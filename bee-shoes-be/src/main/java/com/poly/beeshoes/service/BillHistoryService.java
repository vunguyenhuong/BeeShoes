package com.poly.beeshoes.service;

import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.BillHistoryRequest;
import com.poly.beeshoes.dto.response.BillHistoryResponse;

import java.util.List;

public interface BillHistoryService {
    List<BillHistoryResponse> getByBill(Long idBill);
    ResponseObject create(BillHistoryRequest request);
}
