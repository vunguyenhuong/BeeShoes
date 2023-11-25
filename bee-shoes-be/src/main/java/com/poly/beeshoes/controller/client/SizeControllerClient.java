package com.poly.beeshoes.controller.client;

import com.poly.beeshoes.dto.request.properties.SizeRequest;
import com.poly.beeshoes.dto.response.SizeResponse;
import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client/api/size")
public class SizeControllerClient {
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
