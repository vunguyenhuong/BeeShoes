package com.poly.beeshoes.controller.admin;


import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonParser;
import com.poly.beeshoes.dto.request.UpdateBillDetailGiveBack;
import com.poly.beeshoes.dto.request.UpdateBillGiveBack;
import com.poly.beeshoes.dto.response.statistic.StatisticBillStatus;
import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.billdetail.BillClientRequest;
import com.poly.beeshoes.dto.request.bill.BillRequest;
import com.poly.beeshoes.dto.request.bill.BillSearchRequest;
import com.poly.beeshoes.service.BillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/bill")
public class BillController {
    @Autowired
    private BillService billService;

    @GetMapping
    public PageableObject getAll(BillSearchRequest request) {
        return billService.getAll(request);
    }
    @GetMapping("/statistic-bill-status")
    public List<StatisticBillStatus> statisticBillStatus(){
        return billService.statisticBillStatus();
    }

    @GetMapping("/{id}")
    public Bill getOne(@PathVariable Long id) {
        return billService.getOne(id);
    }

    @PostMapping
    public ResponseObject create() {
        return new ResponseObject(billService.create());
    }
    @PostMapping("/create-bill-client")
    public ResponseObject create(@RequestBody BillClientRequest request) {
        return new ResponseObject(billService.createBillClient(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid BillRequest request) {
        return new ResponseObject(billService.update(id, request));
    }

    @GetMapping("/change-status/{id}")
    public ResponseObject changeStatus(@PathVariable Long id, @RequestParam String note) {
        return new ResponseObject(billService.changeStatus(id, note));
    }

    @GetMapping("/give-back-information")
    public ResponseObject BillGiveBackInformation (@RequestParam("codeBill") String codeBill){
        return new ResponseObject(billService.getBillGiveBackInformation(codeBill));
    }

    @GetMapping("/give-back")
    public ResponseObject BillGiveBack (@RequestParam("idBill") String ibBill){
        return new ResponseObject(billService.getBillGiveBack(ibBill));
    }

    @PostMapping("/give-back")
    public ResponseObject UpdateBillGiveBack (@RequestParam("updateBill") String updateBill,
                                              @RequestParam("data") String data){

        Gson gson = new Gson();
        UpdateBillGiveBack updateBillGiveBack = gson.fromJson(updateBill, UpdateBillGiveBack.class);

        JsonArray jsonData = JsonParser.parseString(data).getAsJsonArray();
        List<UpdateBillDetailGiveBack> listDataBillDetail =  new ArrayList<>();
        for (JsonElement dataBillDetail : jsonData) {
            UpdateBillDetailGiveBack detail = gson.fromJson(dataBillDetail, UpdateBillDetailGiveBack.class);
            listDataBillDetail.add(detail);
        }
        System.out.println(listDataBillDetail);
        return new ResponseObject(billService.updateBillGiveBack(updateBillGiveBack, listDataBillDetail));
    }
}
