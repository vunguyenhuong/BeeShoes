package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Voucher;
import com.poly.beeshoes.dto.request.VoucherRequest;
import com.poly.beeshoes.dto.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVoucherRepository extends JpaRepository<Voucher, Long> {
    @Query(value = """
            SELECT
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            v.code AS code, v.name AS name,
            v.quantity AS quantity, v.percent_reduce AS percentReduce,
            v.min_bill_value AS minBillValue,
            v.create_at AS endDate,
            v.status AS status
            FROM voucher v 
            JOIN account_voucher av ON v.id = av.voucher_id
            WHERE av.account_id = :idAccount
            """, nativeQuery = true)
    List<VoucherResponse> getAccountVoucher(@Param("idAccount") Long idAccount);

    @Query(value = """
            SELECT v.id AS id,
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            v.code AS code, v.name AS name,
            v.quantity AS quantity, v.percent_reduce AS percentReduce,
            v.min_bill_value AS minBillValue,
            v.create_at AS endDate,
            v.status AS status
            FROM voucher v
            WHERE (:#{#req.name} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
            AND (:#{#req.deleted} IS NULL OR v.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
            AND v.type = true;
""", nativeQuery = true)
    List<VoucherResponse> getPublicVoucher();
    @Query(value = """
            SELECT v.id AS id,
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            v.code AS code, v.name AS name,
            v.quantity AS quantity, v.percent_reduce AS percentReduce,
            v.min_bill_value AS minBillValue,
            v.create_at AS endDate,
            v.status AS status
            FROM voucher v
            WHERE (:#{#req.name} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
            AND (:#{#req.deleted} IS NULL OR v.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
            """, nativeQuery = true)
    Page<VoucherResponse> getAllVoucher(@Param("req") VoucherRequest request, Pageable pageable);
    @Query("""
            SELECT a FROM Voucher a 
            WHERE (:#{#req.name} IS NULL 
            OR a.name LIKE %:#{#req.name}% OR a.code LIKE %:#{#req.name}%)
                        
            AND (:#{#req.deleted} IS NULL OR a.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR a.status = :#{#req.status})
            ORDER BY a.createAt DESC 
            """)
    Page<Voucher> getAll(@Param("req") VoucherRequest request, Pageable pageable);
    Boolean existsByCode(String code);
}
