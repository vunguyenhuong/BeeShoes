package com.poly.beeshoes.controller;

import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.response.CategoryResponse;
import com.poly.beeshoes.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public PageableObject<CategoryResponse> getAll(@RequestParam(required = false, defaultValue = "") String name,
                                                   @RequestParam(required = false, defaultValue = "1") Integer page,
                                                   @RequestParam(required = false) Boolean status) {
        return categoryService.getAll(name, page, status);
    }

    @GetMapping("/{id}")
    public Category getOne(@PathVariable Long id) {
        return categoryService.getOne(id);
    }

    @PostMapping
    public ResponseObject create(@RequestBody @Valid Category category) {
        return new ResponseObject(categoryService.create(category));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id, @RequestBody @Valid Category category) {
        return new ResponseObject(categoryService.update(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseObject delete(@PathVariable Long id) {
        return new ResponseObject(categoryService.delete(id));
    }
}
