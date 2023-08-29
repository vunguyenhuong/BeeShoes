package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.infrastructure.request.ShoeRequest;
import com.poly.beeshoes.repository.IBrandRepository;
import com.poly.beeshoes.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ShoeConvert {
    @Autowired
    private ICategoryRepository categoryRepository;
    @Autowired
    private IBrandRepository brandRepository;
    public Shoe convertRequestToEntity(ShoeRequest request){
        Shoe shoe = Shoe.builder()
                .name(request.getName())
                .category(categoryRepository.findById(request.getCategory()).get())
                .brand(brandRepository.findById(request.getBrand()).get())
                .build();
        return shoe;
    }
    public Shoe convertRequestToEntity(Shoe entity, ShoeRequest request){
        entity.setName(request.getName());
        entity.setCategory(categoryRepository.findById(request.getCategory()).get());
        entity.setBrand(brandRepository.findById(request.getBrand()).get());
        return entity;
    }
}
