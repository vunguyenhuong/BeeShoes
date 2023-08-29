package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Size;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Size.class})
public interface SizeResponse {
    Long getId();

    String getName();
}
