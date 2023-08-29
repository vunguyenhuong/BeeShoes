package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.response.ColorResponse;

public interface ColorService {
    PageableObject<ColorResponse> getAll(String name, Integer page, Boolean status);

    Color getOne(Long id);

    Color create(Color color);

    Color update(Long id, Color color);

    Color delete(Long id);
}
