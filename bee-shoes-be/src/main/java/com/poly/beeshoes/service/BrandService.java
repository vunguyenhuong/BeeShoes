package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.response.BrandResponse;

public interface BrandService {
    PageableObject<BrandResponse> getAll(String name, Integer page, Boolean status);

    Brand getOne(Long id);

    Brand create(Brand brand);

    Brand update(Long id, Brand brand);

    Brand delete(Long id);
}
