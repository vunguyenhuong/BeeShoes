package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.properties.SizeRequest;
import com.poly.beeshoes.dto.response.SizeResponse;
import com.poly.beeshoes.service.SizeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/size")
public class SizeController {
    @Autowired
    private SizeService sizeService;

    @GetMapping
    public PageableObject<SizeResponse> getAll(SizeRequest request) {
        return sizeService.getAll(request);
    }

    @GetMapping("/{id}")
    public Size getOne(@PathVariable Long id) {
        return sizeService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid SizeRequest request) {
        return new ResponseObject(sizeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid SizeRequest request) {
        return new ResponseObject(sizeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(sizeService.delete(id));
    }
}
