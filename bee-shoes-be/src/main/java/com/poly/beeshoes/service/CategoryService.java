package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.response.CategoryResponse;

public interface CategoryService {
    PageableObject<CategoryResponse> getAll(String name, Integer page, Boolean status);

    Category getOne(Long id);

    Category create(Category category);

    Category update(Long id, Category category);

    Category delete(Long id);
}
