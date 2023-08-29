package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.infrastructure.converter.ShoeConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.request.ShoeRequest;
import com.poly.beeshoes.infrastructure.response.ShoeResponse;
import com.poly.beeshoes.repository.IShoeRepository;
import com.poly.beeshoes.service.ShoeService;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ShoeServiceImpl implements ShoeService {
    @Autowired
    private IShoeRepository shoeRepository;
    @Autowired
    private ShoeConvert shoeConvert;

    @Override
    public PageableObject<ShoeResponse> getAll(ShoeRequest request) {
        Pageable pageable = PageRequest.of(request.getPage() - 1, request.getSizePage());
        return new PageableObject<>(shoeRepository.getAllShoe(request, pageable));
    }

    @Override
    public Shoe getOne(Long id) {
        return shoeRepository.findById(id).orElse(null);
    }

    @Override
    public Shoe create(ShoeRequest request) {
        if (shoeRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RestApiException(request.getName() + " đã tồn tại!");
        }
        Shoe shoe = shoeConvert.convertRequestToEntity(request);
        return shoeRepository.save(shoe);
    }

    @Override
    public Shoe update(Long id, ShoeRequest request) {
        Shoe oldShoe = shoeRepository.findById(id).get();
        if (shoeRepository.existsByNameIgnoreCase(request.getName())) {
            if (oldShoe.getName().equals(request.getName())) {
                return shoeRepository.save(shoeConvert.convertRequestToEntity(oldShoe, request));
            }
            throw new RestApiException(request.getName() + " đã tồn tại!");
        } else {
            return shoeRepository.save(shoeConvert.convertRequestToEntity(oldShoe, request));
        }
    }

    @Override
    public Shoe delete(Long id) {
        return null;
    }
}
