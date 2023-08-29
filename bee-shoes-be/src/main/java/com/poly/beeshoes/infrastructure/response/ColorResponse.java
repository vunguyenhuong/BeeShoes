package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Color;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Color.class})
public interface ColorResponse {
    Long getId();

    String getName();
}
