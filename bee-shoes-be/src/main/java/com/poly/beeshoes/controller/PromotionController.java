package com.poly.beeshoes.controller;

import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.PromotionRequest;
import com.poly.beeshoes.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promotion")
public class PromotionController {
    @Autowired
    private PromotionService service;

    @GetMapping
    public PageableObject getAll(PromotionRequest request) {
        return service.getAll(request);
    }
}
