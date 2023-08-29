package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface IBillRepository extends JpaRepository<Bill, Long> {

    @Query("""
            SELECT b FROM Bill b
            WHERE b.deleted = false 
            AND (:value IS NULL OR :value = '' OR b.customerName LIKE %:value%
            OR b.phoneNumber LIKE %:value%
            OR b.code LIKE %:value%)
            AND b.totalMoney >= :minPrice AND b.totalMoney <= :maxPrice
            ORDER BY b.updateAt DESC
            """)
    Page<Bill> getAllBill(
            @Param("value") String value,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    Boolean existsByCode(String code);

    List<Bill> findByAccountIdAndStatusAndDeletedFalse(Long idAccount, Integer status);
}
