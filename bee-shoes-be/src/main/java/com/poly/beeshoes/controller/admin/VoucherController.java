package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.dto.response.VoucherResponse;
import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.VoucherRequest;
import com.poly.beeshoes.service.VoucherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/voucher")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping("/private/{id}")
    public ResponseObject getAccountVoucher(@PathVariable Long id,VoucherRequest request){
        return new ResponseObject(voucherService.getAccountVoucher(id,request));
    }

    @GetMapping("/public")
    public ResponseObject getPublicVoucher(VoucherRequest request){
        return new ResponseObject(voucherService.getPublicVoucher(request));
    }

    @GetMapping
    public PageableObject getAll(final VoucherRequest request) {
        return voucherService.getAll(request);
    }

    @PostMapping("add")
    public ResponseObject addVoucher(@RequestBody @Valid VoucherRequest request) {
        return new ResponseObject(voucherService.add(request));

    }

    @PutMapping("/update/{id}")
    public ResponseObject updateVocher(@RequestBody @Valid VoucherRequest request, @PathVariable Long id) {
        return new ResponseObject(voucherService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponse> getOne(@PathVariable Long id) {
        return new ResponseEntity<>(voucherService.getOne(id), HttpStatus.OK);
    }
    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate( @PathVariable Long id) {
        return new ResponseObject(voucherService.updateEndDate(id));
    }
}
