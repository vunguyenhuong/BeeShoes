package com.poly.beeshoes.controller;

import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.response.SizeResponse;
import com.poly.beeshoes.service.SizeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/size")
public class SizeController {
    @Autowired
    private SizeService sizeService;

    @GetMapping
    public PageableObject<SizeResponse> getAll(@RequestParam(required = false, defaultValue = "") String name,
                                               @RequestParam(required = false, defaultValue = "1") Integer page,
                                               @RequestParam(required = false) Boolean status) {
        return sizeService.getAll(name, page, status);
    }

    @GetMapping("/{id}")
    public Size getOne(@PathVariable Long id) {
        return sizeService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid Size size) {
        return new ResponseObject(sizeService.create(size));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid Size size) {
        return new ResponseObject(sizeService.update(id, size));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(sizeService.delete(id));
    }
}
