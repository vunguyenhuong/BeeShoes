package com.poly.beeshoes.controller;

import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.response.SoleResponse;
import com.poly.beeshoes.service.SoleService;
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
@RequestMapping("/api/sole")
public class SoleController {
    @Autowired
    private SoleService soleService;

    @GetMapping
    public PageableObject<SoleResponse> getAll(@RequestParam(required = false, defaultValue = "") String name,
                                               @RequestParam(required = false, defaultValue = "1") Integer page,
                                               @RequestParam(required = false) Boolean status) {
        return soleService.getAll(name, page, status);
    }

    @GetMapping("/{id}")
    public Sole getOne(@PathVariable Long id) {
        return soleService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid Sole sole) {
        return new ResponseObject(soleService.create(sole));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid Sole sole) {
        return new ResponseObject(soleService.update(id, sole));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(soleService.delete(id));
    }
}
