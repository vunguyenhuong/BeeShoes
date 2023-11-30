package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.request.CartClientRequest;
import com.poly.beeshoes.entity.CartDetail;
import com.poly.beeshoes.repository.ICartDetailRepository;
import com.poly.beeshoes.service.CartDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartDetailServiceImpl implements CartDetailService {
    @Autowired
    private ICartDetailRepository cartDetailRepository;

    @Override
    public Boolean deleteCartDetail(Long id) {
        cartDetailRepository.deleteById(id);
        return true;
    }

    @Override
    public String changeQuantity(CartClientRequest cartClientRequest) {
        CartDetail cartDetail = cartDetailRepository.findById(cartClientRequest.getId()).get();
        cartDetail.setQuantity(cartDetail.getQuantity());
        cartDetailRepository.save(cartDetail);
        return "ok";
    }
}
