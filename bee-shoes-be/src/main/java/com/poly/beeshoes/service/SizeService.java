package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.SizeRequest;
import com.poly.beeshoes.infrastructure.response.SizeResponse;

public interface SizeService {
    PageableObject<SizeResponse> getAll(SizeRequest request);

    Size getOne(Long id);

    Size create(SizeRequest request);

    Size update(Long id, SizeRequest request);

    Size delete(Long id);
}
