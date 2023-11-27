package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.request.UpdateBillDetailGiveBack;
import com.poly.beeshoes.dto.request.UpdateBillGiveBack;
import com.poly.beeshoes.dto.response.BillGiveBackInformationResponse;
import com.poly.beeshoes.dto.response.BillProductGiveback;
import com.poly.beeshoes.dto.response.statistic.StatisticBillStatus;
import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.billdetail.BillClientRequest;
import com.poly.beeshoes.dto.request.bill.BillRequest;
import com.poly.beeshoes.dto.request.bill.BillSearchRequest;
import com.poly.beeshoes.dto.response.BillResponse;

import java.util.List;

public interface BillService {
    PageableObject<BillResponse> getAll(BillSearchRequest request);
    Bill getOne(Long id);
    Bill create();
    Bill update(Long id,BillRequest request);
    ResponseObject createBillClient(BillClientRequest request);
    Bill delete(Long id);
    Bill changeStatus(Long id, String status);
    List<StatisticBillStatus> statisticBillStatus();

    BillGiveBackInformationResponse getBillGiveBackInformation(String codeBill);

    List<BillProductGiveback> getBillGiveBack(String idBill);

    Bill updateBillGiveBack(UpdateBillGiveBack updateBillGiveBack , List<UpdateBillDetailGiveBack> updateBillDetailGiveBacks);

}
