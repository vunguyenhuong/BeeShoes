package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Cart;
import com.poly.beeshoes.entity.CartDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICartRepository extends JpaRepository<Cart, CartDetailId> {
}
