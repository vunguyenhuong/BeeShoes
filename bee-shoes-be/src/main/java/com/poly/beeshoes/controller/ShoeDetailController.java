package com.poly.beeshoes.controller;

import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.request.ShoeDetailRequest;
import com.poly.beeshoes.service.ShoeDetailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shoe-detail")
public class ShoeDetailController {
    @Autowired
    private ShoeDetailService shoeDetailService;

    @GetMapping
    public PageableObject<ShoeDetail> getAll(ShoeDetailRequest request) {
        return shoeDetailService.getAll(request);
    }

    @GetMapping("/{id}")
    public ShoeDetail getOne(@PathVariable Long id) {
        return shoeDetailService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@ModelAttribute @Valid ShoeDetailRequest request) {
        return new ResponseObject(shoeDetailService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject create(@PathVariable Long id, @ModelAttribute @Valid ShoeDetailRequest request) {
        return new ResponseObject(shoeDetailService.update(id, request));
    }
}
