package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.dto.request.properties.SizeRequest;
import org.springframework.stereotype.Component;

@Component
public class SizeConvert {
    public Size convertRequestToEntity(SizeRequest request){
        Size size = Size.builder()
                .name(request.getName())
                .build();
        return size;
    }

    public Size convertRequestToEntity(Size entity, SizeRequest request){
        entity.setName(request.getName());
        return entity;
    }
}
