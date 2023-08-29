package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.BillHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IBillHistoryRepository extends JpaRepository<BillHistory, Long> {
    List<BillHistory> findByBillId(Long idBill);
}
