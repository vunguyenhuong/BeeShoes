package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Cart;
import com.poly.beeshoes.entity.CartDetail;
import com.poly.beeshoes.entity.ShoeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICartDetailRepository extends JpaRepository<CartDetail, Long> {
    List<CartDetail> getCartDetailsByCartId(Long cart);

    List<CartDetail> getCartDetailsByCartIdAndShoeDetailId(Long cart, Long shoeDetail);
}
