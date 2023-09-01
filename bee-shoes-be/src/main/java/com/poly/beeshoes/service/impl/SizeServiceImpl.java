package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.response.SizeResponse;
import com.poly.beeshoes.repository.ISizeRepository;
import com.poly.beeshoes.service.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class SizeServiceImpl implements SizeService {
    @Autowired
    private ISizeRepository repository;

    @Override
    public PageableObject<SizeResponse> getAll(String name, Integer page, Boolean status) {
        return new PageableObject<>(repository.getAll(name, status, PageRequest.of(page - 1, 5)));
    }

    @Override
    public Size getOne(Long id) {
        return repository.findById(id).get();
    }

    @Override
    public Size create(Size size) {
        if (repository.existsByNameIgnoreCaseAndNameNot(size.getName(), "")) {
            throw new RestApiException("Thuộc tính " + size.getName() + " đã tồn tại!");
        }
        return repository.save(size);
    }

    @Override
    public Size update(Long id, Size size) {
        Size old = this.getOne(id);
        if (repository.existsByNameIgnoreCaseAndNameNot(size.getName(), old.getName())) {
            throw new RestApiException("Thuộc tính " + size.getName() + " đã tồn tại!");
        }
        old.setName(size.getName());
        return repository.save(old);
    }

    @Override
    public Size delete(Long id) {
        Size size = this.getOne(id);
        size.setDeleted(!size.getDeleted());
        return repository.save(size);
    }
}
