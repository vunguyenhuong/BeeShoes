package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.dto.request.properties.CategoryRequest;
import org.springframework.stereotype.Component;

@Component
public class CategoryConvert {
    public Category convertRequestToEntity(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .build();
        return category;
    }

    public Category convertRequestToEntity(Category entity, CategoryRequest request) {
        entity.setName(request.getName());
        return entity;
    }
}
