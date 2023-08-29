package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.response.SoleResponse;
import com.poly.beeshoes.repository.ISoleRepository;
import com.poly.beeshoes.service.SoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class SoleServiceImpl implements SoleService {
    @Autowired
    private ISoleRepository repository;

    @Override
    public PageableObject<SoleResponse> getAll(String name, Integer page, Boolean status) {
        return new PageableObject<>(repository.getAll(name,status, PageRequest.of(page-1,5)));
    }

    @Override
    public Sole getOne(Long id) {
        return repository.findById(id).get();
    }

    @Override
    public Sole create(Sole sole) {
        if (repository.existsByNameIgnoreCaseAndNameNot(sole.getName(), "")) {
            throw new RestApiException(sole.getName() + " đã tồn tại!");
        }
        return repository.save(sole);
    }

    @Override
    public Sole update(Long id, Sole sole) {
        Sole old = this.getOne(id);
        if (repository.existsByNameIgnoreCaseAndNameNot(sole.getName(), old.getName())) {
            throw new RestApiException(sole.getName() + " đã tồn tại!");
        }
        old.setName(sole.getName());
        return repository.save(old);
    }

    @Override
    public Sole delete(Long id) {
        Sole sole = this.getOne(id);
        sole.setDeleted(!sole.getDeleted());
        return repository.save(sole);
    }
}
