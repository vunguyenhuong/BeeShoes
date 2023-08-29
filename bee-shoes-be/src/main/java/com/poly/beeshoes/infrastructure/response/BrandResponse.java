package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Brand;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Brand.class})
public interface BrandResponse {
    Long getId();
    String getName();
}
