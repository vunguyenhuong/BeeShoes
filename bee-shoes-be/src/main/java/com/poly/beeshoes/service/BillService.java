package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.request.giveback.GivebackRequest;
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

    List<Bill> getNewBill(BillSearchRequest request);

    Bill getOne(Long id);

    Bill findByCode(String code);

    Bill create();

    Bill orderBill(Long id, BillRequest request);

    Bill updateBill();

    ResponseObject createBillClient(BillClientRequest request);

    ResponseObject createBillClientVnpay(BillClientRequest request, String code);

    Bill delete(Long id);

    Bill changeStatus(Long id, String status, Boolean isCancel);

    Bill changeInfoCustomer(Long id, BillRequest request);

    List<StatisticBillStatus> statisticBillStatus();

    ResponseObject givebackAll(Long idBill, String note);
    ResponseObject giveback(GivebackRequest request);
}
