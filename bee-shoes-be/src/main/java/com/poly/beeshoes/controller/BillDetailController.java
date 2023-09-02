package com.poly.beeshoes.controller;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.BillDetailRequest;
import com.poly.beeshoes.infrastructure.response.BillDetailResponse;
import com.poly.beeshoes.service.BillDetailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bill-detail")
public class BillDetailController {
    @Autowired
    private BillDetailService billDetailService;

    @GetMapping
    public PageableObject<BillDetailResponse> getAll(BillDetailRequest request){
        return billDetailService.getAll(request);
    }

    @GetMapping("/{id}")
    public BillDetail getOne(@PathVariable Long id) {
        return billDetailService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid BillDetailRequest request){
        return new ResponseObject(billDetailService.create(request));
    }
    @PutMapping("/{id}")
    public ResponseObject create(@PathVariable Long id,@RequestBody @Valid BillDetailRequest request){
        return new ResponseObject(billDetailService.update(id,request));
    }

}
