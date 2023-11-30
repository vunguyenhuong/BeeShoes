package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.request.CartClientRequest;
import com.poly.beeshoes.dto.response.CartResponse;
import com.poly.beeshoes.entity.Cart;
import com.poly.beeshoes.entity.CartDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.ICartDetailRepository;
import com.poly.beeshoes.repository.ICartRepository;
import com.poly.beeshoes.repository.IShoeDetailRepository;
import com.poly.beeshoes.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private ICartRepository cartRepository;
    @Autowired
    private IAccountRepository accountRepository;
    @Autowired
    private IShoeDetailRepository shoeDetailRepository;
    @Autowired
    private ICartDetailRepository cartDetailRepository;

    @Override
    public List<CartResponse> getListCart(Long idAccount) {
        return cartRepository.getListCart(idAccount);
    }

    @Override
    public ResponseObject create(CartClientRequest request) {
        ShoeDetail shoeDetail = shoeDetailRepository.findById(request.getShoeDetail()).get();
        Cart cartCheck = cartRepository.findByAccountId(request.getId());
        if (cartCheck == null) {
            Cart cart = new Cart();
            cart.setAccount(accountRepository.findById(request.getId()).orElse(null));
            cartCheck = cartRepository.save(cart);
        }

        CartDetail cartDetailCheck = cartDetailRepository.findByCartIdAndShoeDetailId(cartCheck.getId(), request.getShoeDetail());
        if (cartDetailCheck != null) {
            if (request.getQuantity() <= 0) {
                throw new RestApiException("Số lượng phải >= 0!");
            }
            if (cartDetailCheck.getQuantity() + request.getQuantity() > shoeDetail.getQuantity()) {
                throw new RestApiException("Quá số lượng cho phép!");
            }
            if (request.getQuantity() > 10) {
                throw new RestApiException("Chỉ được mua tối đa 10 sản phẩm!");
            }
            cartDetailCheck.setQuantity(cartDetailCheck.getQuantity() + request.getQuantity());
            cartDetailRepository.save(cartDetailCheck);
        } else {
            CartDetail cartDetail = new CartDetail();
            cartDetail.setCart(cartCheck);
            cartDetail.setQuantity(request.getQuantity());
            if (request.getQuantity() > shoeDetail.getQuantity()) {
                throw new RestApiException("Quá số lượng cho phép!");
            }
            cartDetail.setShoeDetail(shoeDetailRepository.findById(request.getShoeDetail()).get());
            cartDetailRepository.save(cartDetail);
        }
        return new ResponseObject("OK");
    }

    @Override
    public ResponseObject updateQuantity(CartClientRequest request) {
        CartDetail cartDetail = cartDetailRepository.findById(request.getId()).get();
        if (request.getQuantity() <= 0) {
            throw new RestApiException("Số lượng phải >= 0!");
        }
        if (request.getQuantity() > cartDetail.getShoeDetail().getQuantity()) {
            throw new RestApiException("Quá số lượng cho phép!");
        }
        if (request.getQuantity() > 10) {
            throw new RestApiException("Chỉ được mua tối đa 10 sản phẩm!");
        }
        cartDetail.setQuantity(request.getQuantity());
        cartDetailRepository.save(cartDetail);
        return new ResponseObject("ok");
    }

    @Override
    public ResponseObject deleteById(Long idCartDetail) {
        cartDetailRepository.deleteById(idCartDetail);
        return new ResponseObject("OK");
    }

    @Override
    public ResponseObject deleteAll(Long idAccount) {
        Cart cart = cartRepository.findByAccountId(idAccount);
        List<CartDetail> cartDetails = cartDetailRepository.findByCartId(cart.getId());
        cartDetailRepository.deleteAll(cartDetails);
        return new ResponseObject("OK");
    }
}
