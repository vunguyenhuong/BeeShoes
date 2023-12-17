package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.dto.request.shoedetail.UpdateShoeDetailRequest;
import com.poly.beeshoes.dto.response.ShoeDetailResponse;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.dto.request.shoedetail.ShoeDetailRequest;
import com.poly.beeshoes.dto.request.shoedetail.FindShoeDetailRequest;
import com.poly.beeshoes.service.ShoeDetailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shoe-detail")
public class ShoeDetailController {
    @Autowired
    private ShoeDetailService shoeDetailService;

    @GetMapping
    public PageableObject getAll(FindShoeDetailRequest request) {
        return shoeDetailService.getAll(request);
    }

    @GetMapping("/{id}")
    public ShoeDetail getOne(@PathVariable Long id) {
        return shoeDetailService.getOne(id);
    }

    @GetMapping("/get-one/{id}")
    public ResponseObject getOneShoeDetail(@PathVariable Long id){
        return new ResponseObject(shoeDetailService.getOneShoeDetail(id));
    }

    @GetMapping("/find-min-max-price")
    public Map<String, BigDecimal> findMinAndMaxPrice(){
        return shoeDetailService.findMinAndMaxPrice();
    }

    @PostMapping
    public ResponseObject create(@RequestBody List<ShoeDetailRequest> list) {
        return new ResponseObject(shoeDetailService.create(list));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid UpdateShoeDetailRequest request) {
        return new ResponseObject(shoeDetailService.update(id, request));
    }

    @PutMapping("/update-fast")
    public ResponseObject updateFast(@RequestBody List<ShoeDetailRequest> list) {
        list.forEach(request -> System.out.println(request));
        return new ResponseObject(shoeDetailService.updateFast(list));
    }
}
