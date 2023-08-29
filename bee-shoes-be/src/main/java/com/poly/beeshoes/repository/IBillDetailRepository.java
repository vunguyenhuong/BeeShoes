package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.BillDetail;
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
}
