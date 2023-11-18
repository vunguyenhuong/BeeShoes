package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.dto.request.properties.ColorRequest;
import org.springframework.stereotype.Component;

@Component
public class ColorConvert {
    public Color convertRequestToEntity(ColorRequest request){
        Color size = Color.builder()
                .name(request.getName())
                .build();
        return size;
    }

    public Color convertRequestToEntity(Color entity, ColorRequest request){
        entity.setName(request.getName());
        return entity;
    }
}
