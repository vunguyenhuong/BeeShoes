package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.response.SizeResponse;

public interface SizeService {
    PageableObject<SizeResponse> getAll(String name, Integer page, Boolean status);

    Size getOne(Long id);

    Size create(Size size);

    Size update(Long id, Size size);

    Size delete(Long id);
}
