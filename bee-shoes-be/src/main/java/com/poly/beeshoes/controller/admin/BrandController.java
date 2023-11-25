package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.properties.BrandRequest;
import com.poly.beeshoes.dto.response.BrandResponse;
import com.poly.beeshoes.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/brand")
public class BrandController {
    @Autowired
    private BrandService brandService;

    @GetMapping
    public PageableObject<BrandResponse> getAll(BrandRequest request) {
        return brandService.getAll(request);
    }


    @GetMapping("/{id}")
    public Brand getOne(@PathVariable Long id) {
        return brandService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid BrandRequest request) {
        return new ResponseObject(brandService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid BrandRequest request) {
        return new ResponseObject(brandService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(brandService.delete(id));
    }
}
