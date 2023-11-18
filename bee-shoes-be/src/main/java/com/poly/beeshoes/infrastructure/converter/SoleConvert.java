package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.dto.request.properties.SoleRequest;
import org.springframework.stereotype.Component;

@Component
public class SoleConvert {
    public Sole convertRequestToEntity(SoleRequest request){
        Sole size = Sole.builder()
                .name(request.getName())
                .build();
        return size;
    }

    public Sole convertRequestToEntity(Sole entity, SoleRequest request){
        entity.setName(request.getName());
        return entity;
    }
}
