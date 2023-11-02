package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.PromotionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPromotionDetailRepository extends JpaRepository<PromotionDetail, Long> {
    Boolean existsByShoeDetailId(Long id);
}
