package com.poly.beeshoes.controller.admin;

import com.poly.beeshoes.dto.request.shoe.FindShoeReqeust;
import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.dto.request.shoe.ShoeRequest;
import com.poly.beeshoes.dto.response.ShoeResponse;
import com.poly.beeshoes.dto.response.promotion.ShoePromotionResponse;
import com.poly.beeshoes.service.ShoeService;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
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

import java.util.List;

@RestController
@RequestMapping("/api/shoe")
public class ShoeController {
    @Autowired
    private ShoeService shoeService;
    @GetMapping("/shoe-promotion")
    public List<ShoePromotionResponse> getTest(@RequestParam(required = false) Long promotion){
        return shoeService.getAllShoeInPromotion(promotion);
    }

    @GetMapping("/top-sell")
    public List<ShoeResponse> getTopSell(@RequestParam(required = false, defaultValue = "5") Integer top){
        return shoeService.getTopSell(top);
    }

    @GetMapping
    public PageableObject<ShoeResponse> getAll(FindShoeReqeust request) {
        return shoeService.getAll(request);
    }

    @GetMapping("/{id}")
    public Shoe getOne(@PathVariable Long id) {
        return shoeService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid ShoeRequest request) {
        return new ResponseObject(shoeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid ShoeRequest request){
        return new ResponseObject(shoeService.update(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseObject changeStatus(@PathVariable Long id){
        return new ResponseObject(shoeService.changeStatus(id));
    }
}
