package com.poly.beeshoes.controller.client;

import com.poly.beeshoes.dto.request.BillHistoryRequest;
import com.poly.beeshoes.dto.response.BillHistoryResponse;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.service.BillHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/client/api/bill-history")
public class BillHistoryControllerClient {
    @Autowired
    private BillHistoryService billHistoryService;
    @GetMapping("/{idBill}")
    public List<BillHistoryResponse> getByBill(@PathVariable("idBill") Long id){
        return billHistoryService.getByBill(id);
    }
    @PostMapping
    public ResponseObject create(@RequestBody BillHistoryRequest request){
        return billHistoryService.create(request);
    }
}
