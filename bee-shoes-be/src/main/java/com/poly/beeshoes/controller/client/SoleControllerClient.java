package com.poly.beeshoes.controller.client;

import com.poly.beeshoes.dto.request.properties.SoleRequest;
import com.poly.beeshoes.dto.response.SoleResponse;
import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client/api/sole")
public class SoleControllerClient {
    @Autowired
    private SoleService soleService;

    @GetMapping
    public PageableObject<SoleResponse> getAll(SoleRequest request) {
        return soleService.getAll(request);
    }

    @GetMapping("/{id}")
    public Sole getOne(@PathVariable Long id) {
        return soleService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid SoleRequest request) {
        return new ResponseObject(soleService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid SoleRequest request) {
        return new ResponseObject(soleService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(soleService.delete(id));
    }
}
