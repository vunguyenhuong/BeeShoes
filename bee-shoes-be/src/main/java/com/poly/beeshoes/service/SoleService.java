package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.response.SoleResponse;

public interface SoleService {
    PageableObject<SoleResponse> getAll(String name, Integer page, Boolean status);

    Sole getOne(Long id);

    Sole create(Sole sole);

    Sole update(Long id, Sole sole);

    Sole delete(Long id);
}
