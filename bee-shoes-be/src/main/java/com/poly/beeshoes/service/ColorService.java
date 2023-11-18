package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.dto.request.properties.ColorRequest;
import com.poly.beeshoes.dto.response.ColorResponse;

public interface ColorService {
    PageableObject<ColorResponse> getAll(ColorRequest request);

    Color getOne(Long id);

    Color create(ColorRequest request);

    Color update(Long id, ColorRequest request);

    Color delete(Long id);
}
