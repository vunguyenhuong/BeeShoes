package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.request.CategoryRequest;
import com.poly.beeshoes.infrastructure.response.CategoryResponse;

public interface CategoryService {
    PageableObject<CategoryResponse> getAll(CategoryRequest request);

    Category getOne(Long id);

    Category create(CategoryRequest request);

    Category update(Long id, CategoryRequest request);

    Category delete(Long id);
}
