package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByBillId(Long id);
}
