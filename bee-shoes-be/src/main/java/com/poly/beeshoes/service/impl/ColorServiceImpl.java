package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.response.ColorResponse;
import com.poly.beeshoes.repository.IColorRepository;
import com.poly.beeshoes.service.ColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ColorServiceImpl implements ColorService {
    @Autowired
    private IColorRepository repository;

    @Override
    public PageableObject<ColorResponse> getAll(String name, Integer page, Boolean status) {
        Pageable pageable = PageRequest.of(page-1,5);
        return new PageableObject<>(repository.getAll(name,status, pageable));
    }

    @Override
    public Color getOne(Long id) {
        return repository.findById(id).get();
    }

    @Override
    public Color create(Color color) {
        if (repository.existsByNameIgnoreCaseAndNameNot(color.getName(), "")) {
            throw new RestApiException(color.getName() + " đã tồn tại!");
        }
        return repository.save(color);
    }

    @Override
    public Color update(Long id, Color color) {
        Color old = this.getOne(id);
        if (repository.existsByNameIgnoreCaseAndNameNot(color.getName(), old.getName())) {
            throw new RestApiException(color.getName() + " đã tồn tại!");
        }
        old.setName(color.getName());
        return repository.save(old);
    }

    @Override
    public Color delete(Long id) {
        Color color = this.getOne(id);
        color.setDeleted(!color.getDeleted());
        return repository.save(color);
    }
}
