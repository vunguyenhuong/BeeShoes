package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.PromotionRequest;
import com.poly.beeshoes.dto.response.PromotionResponse;
import com.poly.beeshoes.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/promotion")
public class PromotionController {
    @Autowired
    private PromotionService service;

    @GetMapping
    public PageableObject getAll(PromotionRequest request) {
        return service.getAll(request);
    }
    @GetMapping("/{id}")
    public PromotionResponse getOne(@PathVariable Long id){
        return service.getOne(id);
    }
    @GetMapping("/list-shoe-id")
    public List<Long> getListIdShoePromotion(@RequestParam(required = false) Long idPromotion){
        return service.getListIdShoePromotion(idPromotion);
    }

    @GetMapping("/list-shoe-detail-id")
    public List<Long> getListIdShoeDetailPromotion(@RequestParam(required = false) Long idPromotion){
        return service.getListIdShoeDetailInPromotion(idPromotion);
    }

    @PostMapping
    public ResponseObject create(@RequestBody PromotionRequest request){
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id,@RequestBody PromotionRequest request){
        return new ResponseObject(service.update(id,request));
    }

    @DeleteMapping("/delete-all-promotion-detail/{id}")
    public void deleteAllPromotionDetailByPromotion(@PathVariable Long id){
        service.deleteAll(id);
    }

    @PutMapping("/update/end-date/{id}")
    public ResponseObject updateEndDate( @PathVariable Long id) {
        return new ResponseObject(service.updateEndDate(id));
    }

}
