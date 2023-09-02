package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.infrastructure.request.BillRequest;
import com.poly.beeshoes.infrastructure.response.BillResponse;
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

    Boolean existsByCodeIgnoreCase(String code);
    @Query("""
            SELECT b
            FROM Bill b
            WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%)
            AND (:#{#req.account} IS NULL OR b.account.id = :#{#req.account})
            AND (:#{#req.voucher} IS NULL OR b.voucher.id = :#{#req.voucher})
            ORDER BY b.createAt DESC
            """)
    Page<BillResponse> getAllBill(@Param("req") BillRequest request, Pageable pageable);

    Boolean existsByCode(String code);

    List<Bill> findByAccountIdAndStatusAndDeletedFalse(Long idAccount, Integer status);
}
