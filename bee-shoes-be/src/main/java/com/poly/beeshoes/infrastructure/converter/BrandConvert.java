package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.dto.request.properties.BrandRequest;
import org.springframework.stereotype.Component;

@Component
public class BrandConvert {
    public Brand convertRequestToEntity(BrandRequest request) {
        Brand brand = Brand.builder()
                .name(request.getName())
                .build();
        return brand;
    }

    public Brand convertRequestToEntity(Brand entity, BrandRequest request) {
        entity.setName(request.getName());
        return entity;
    }
}
