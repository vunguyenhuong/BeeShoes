package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.properties.ColorRequest;
import com.poly.beeshoes.dto.response.ColorResponse;
import com.poly.beeshoes.service.ColorService;
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
@RequestMapping("/api/color")
public class ColorController {
    @Autowired
    private ColorService colorService;

    @GetMapping
    public PageableObject<ColorResponse> getAll(ColorRequest request) {
        return colorService.getAll(request);
    }

    @GetMapping("/{id}")
    public Color getOne(@PathVariable Long id) {
        return colorService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid ColorRequest request) {
        return new ResponseObject(colorService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid ColorRequest request) {
        return new ResponseObject(colorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(colorService.delete(id));
    }
}
