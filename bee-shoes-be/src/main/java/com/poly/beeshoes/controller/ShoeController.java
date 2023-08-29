package com.poly.beeshoes.controller;

import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.infrastructure.request.ShoeRequest;
import com.poly.beeshoes.infrastructure.response.ShoeResponse;
import com.poly.beeshoes.service.ShoeService;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shoe")
public class ShoeController {
    @Autowired
    private ShoeService shoeService;

    @GetMapping
    public PageableObject<ShoeResponse> getAll(ShoeRequest request) {
        return shoeService.getAll(request);
    }

    @GetMapping("/{id}")
    public Shoe getOne(@PathVariable Long id) {
        return shoeService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid ShoeRequest request) {
        return new ResponseObject(shoeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid ShoeRequest request){
        return new ResponseObject(shoeService.update(id,request));
    }
}
