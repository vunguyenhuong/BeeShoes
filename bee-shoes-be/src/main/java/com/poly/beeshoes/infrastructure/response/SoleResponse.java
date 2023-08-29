package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Sole;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Sole.class})
public interface SoleResponse {
    Long getId();

    String getName();
}
