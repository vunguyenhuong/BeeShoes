package com.poly.beeshoes.controller.client;

import com.poly.beeshoes.dto.request.VoucherRequest;
import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/client/api/voucher")
public class VoucherControllerClient {
    @Autowired
    private VoucherService voucherService;
    @GetMapping("/private/{id}")
    public ResponseObject getAccountVoucher(@PathVariable Long id){
        return new ResponseObject(voucherService.getAccountVoucher(id));
    }
    @GetMapping("/public")
    public ResponseObject getPublicVoucher(){
        return new ResponseObject(voucherService.getPublicVoucher());
    }

    @GetMapping
    public PageableObject getAll(final VoucherRequest request) {
        return voucherService.getAll(request);
    }

    @PostMapping("add")
    public ResponseObject addVoucher(@ModelAttribute @Valid VoucherRequest request) {

        return new ResponseObject(voucherService.add(request));

    }

    @PutMapping("/update/{id}")
    public ResponseObject updateVocher(@ModelAttribute @Valid VoucherRequest request, @PathVariable Long id) {

        return new ResponseObject(voucherService.update(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getOne(@PathVariable Long id) {
        return new ResponseEntity<>(voucherService.getOne(id), HttpStatus.OK);
    }
}
