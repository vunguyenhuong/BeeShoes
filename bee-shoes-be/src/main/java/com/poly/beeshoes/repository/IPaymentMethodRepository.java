package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.PaymentMethod;
import com.poly.beeshoes.dto.response.PaymentMethodResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IPaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY pm.create_at ASC) AS indexs,
            pm.id AS id,
            pm.method AS method, pm.total_money AS totalMoney,
            pm.note AS note,pm.trading_code AS tradingCode,
            pm.create_by AS createBy,
            pm.create_at AS createAt,
            pm.type AS type
            FROM payment_method pm
            WHERE pm.bill_id = :idBill
            """,nativeQuery = true)
    List<PaymentMethodResponse> getByBill(@Param("idBill") Long idBill);
    Boolean existsByBillId(Long id);
    List<PaymentMethod> findByBillIdAndType(Long idBill, Boolean type);
}
