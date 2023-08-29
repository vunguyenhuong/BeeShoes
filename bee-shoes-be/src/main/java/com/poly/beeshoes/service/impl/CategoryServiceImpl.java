package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.response.CategoryResponse;
import com.poly.beeshoes.repository.ICategoryRepository;
import com.poly.beeshoes.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private ICategoryRepository repository;

    @Override
    public PageableObject<CategoryResponse> getAll(String name, Integer page, Boolean status) {
        return new PageableObject<>(repository.getAll(name, status, PageRequest.of(page - 1, 5)));
    }

    @Override
    public Category getOne(Long id) {
        return repository.findById(id).get();
    }

    @Override
    public Category create(Category category) {
        if(repository.existsByNameIgnoreCaseAndNameNot(category.getName(),"")){
            throw new RestApiException(category.getName() + " đã tồn tại!");
        }
        return repository.save(category);
    }

    @Override
    public Category update(Long id, Category category) {
        Category old = repository.findById(id).get();
        if(repository.existsByNameIgnoreCaseAndNameNot(category.getName(),old.getName())){
            throw new RestApiException(category.getName() + " đã tồn tại!");
        }
        old.setName(category.getName());
        return repository.save(old);
    }

    @Override
    public Category delete(Long id) {
        Category category = this.getOne(id);
        category.setDeleted(!category.getDeleted());
        return repository.save(category);
    }
}
