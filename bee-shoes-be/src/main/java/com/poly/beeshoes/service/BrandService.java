package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.dto.request.properties.BrandRequest;
import com.poly.beeshoes.dto.response.BrandResponse;

public interface BrandService {
    PageableObject<BrandResponse> getAll(BrandRequest request);

    Brand getOne(Long id);

    Brand create(BrandRequest request);

    Brand update(Long id, BrandRequest request);

    Brand delete(Long id);
}
