package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.PromotionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPromotionDetailRepository extends JpaRepository<PromotionDetail, Long> {
    Boolean existsByShoeDetailId(Long id);

//    @Query(value = """
//            SELECT FROM promotion_detail pmd
//            JOIN
//            """, nativeQuery = true)
//    List<Long> x();
}
