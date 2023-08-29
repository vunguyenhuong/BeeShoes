package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.response.BrandResponse;
import com.poly.beeshoes.repository.IBrandRepository;
import com.poly.beeshoes.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    private IBrandRepository repository;

    @Override
    public PageableObject<BrandResponse> getAll(String name, Integer page, Boolean status) {
        Pageable pageable = PageRequest.of(page-1, 5);
        return new PageableObject<>(repository.getAll(name, status, pageable));
    }

    @Override
    public Brand getOne(Long id) {
        return repository.findById(id).get();
    }

    @Override
    public Brand create(Brand brand) {
        if(repository.existsByNameIgnoreCaseAndNameNot(brand.getName(),"")){
            throw new RestApiException(brand.getName() + " đã tồn tại!");
        }
        return repository.save(brand);
    }

    @Override
    public Brand update(Long id, Brand brand) {
        Brand old = repository.findById(id).get();
        if(repository.existsByNameIgnoreCaseAndNameNot(brand.getName(),old.getName())){
            throw new RestApiException(brand.getName() + " đã tồn tại!");
        }
        old.setName(brand.getName());
        return repository.save(old);
    }

    @Override
    public Brand delete(Long id) {
        Brand brand = this.getOne(id);
        brand.setDeleted(!brand.getDeleted());
        return repository.save(brand);
    }
}
