package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVoucherRepository extends JpaRepository<Voucher, Long> {
}
