package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.AccountVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAccountVoucherRepository extends JpaRepository<AccountVoucher, Long> {
}
