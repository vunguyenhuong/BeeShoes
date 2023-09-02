package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.infrastructure.request.BillDetailRequest;
import com.poly.beeshoes.infrastructure.response.BillDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBillDetailRepository extends JpaRepository<BillDetail, Long> {
    @Query("SELECT detail FROM BillDetail detail " +
            "WHERE detail.bill.id = :id ")
    BillDetail findBillDetail(@Param("id") Long id);

    List<BillDetail> findByBillId(Long id);

    BillDetail findByShoeDetailCodeAndBillId(String codeShoeDetail, Long idBill);

    Boolean existsByShoeDetailIdAndBillId(Long idShoeDetail, Long idBill);

    @Query("""
            SELECT bd
            FROM BillDetail bd
            WHERE  (:#{#req.code} IS NULL OR bd.bill.code LIKE %:#{#req.code}%)
            AND (:#{#req.minPrice} IS NULL OR :#{#req.maxPrice} IS NULL
            OR bd.price >= :#{#req.minPrice} AND bd.price <= :#{#req.maxPrice})
            """)
    Page<BillDetailResponse> getAllBillDetail(@Param("req") BillDetailRequest request, Pageable pageable);
}
