package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.BillHistory;
import com.poly.beeshoes.dto.response.BillHistoryResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IBillHistoryRepository extends JpaRepository<BillHistory, Long> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY bh.create_at ASC) AS indexs,
            bh.id AS id,
            bh.note AS note, bh.status AS status,
            bh.create_at AS createAt,
            bh.create_by AS createBy
            FROM bill_history bh WHERE bh.bill_id = :#{#idBill}
            """, nativeQuery = true)
    List<BillHistoryResponse> getByBill(@Param("idBill") Long idBill);
}
