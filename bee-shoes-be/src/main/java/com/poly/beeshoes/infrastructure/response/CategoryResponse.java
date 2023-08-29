package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Category;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Category.class})
public interface CategoryResponse {
    Long getId();
    String getName();
}
