package com.poly.beeshoes.controller;


import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.bill.BillRequest;
import com.poly.beeshoes.infrastructure.request.bill.BillSearchRequest;
import com.poly.beeshoes.infrastructure.response.BillResponse;
import com.poly.beeshoes.service.BillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bill")
public class BillController {
    @Autowired
    private BillService billService;

    @GetMapping
    public PageableObject getAll(BillSearchRequest request){
        return billService.getAll(request);
    }

    @GetMapping("/{id}")
    public Bill getOne(@PathVariable Long id) {
        return billService.getOne(id);
    }

    @PostMapping
    public ResponseObject create() {
        return new ResponseObject(billService.create());
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid BillRequest request){
        return new ResponseObject(billService.update(id,request));
    }

}
