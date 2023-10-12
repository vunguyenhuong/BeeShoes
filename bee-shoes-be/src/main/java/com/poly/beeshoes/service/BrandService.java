package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.BrandRequest;
import com.poly.beeshoes.infrastructure.response.BrandResponse;

public interface BrandService {
    PageableObject<BrandResponse> getAll(BrandRequest request);

    Brand getOne(Long id);

    Brand create(BrandRequest request);

    Brand update(Long id, BrandRequest request);

    Brand delete(Long id);
}
