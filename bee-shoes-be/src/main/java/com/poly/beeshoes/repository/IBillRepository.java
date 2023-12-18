package com.poly.beeshoes.repository;

import com.poly.beeshoes.dto.response.statistic.StatisticalDayResponse;
import com.poly.beeshoes.dto.response.statistic.StatisticalMonthlyResponse;
import com.poly.beeshoes.dto.response.statistic.StatisticBillStatus;
import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.dto.request.bill.BillSearchRequest;
import com.poly.beeshoes.dto.response.BillResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBillRepository extends JpaRepository<Bill, Long> {

    Boolean existsByCodeIgnoreCase(String code);

    @Query(value = """
            SELECT  b.id AS id,
            ROW_NUMBER() OVER(ORDER BY b.update_at DESC) AS indexs,
            b.code AS code, b.create_at AS createAt,
            cus.name AS customer,emp.name AS employee,
            b.customer_name AS customerName,
            b.address AS address,
            b.phone_number AS phoneNumber,
            b.total_money AS totalMoney,
            b.money_ship AS moneyShip,
            b.money_reduce AS moneyReduce,
            b.pay_date AS payDate,
            b.ship_date AS shipDate,
            b.desired_date AS desiredDate,
            b.receive_date AS receiveDate,
            b.type AS type,
            b.status AS status,
            b.note AS note,
            v.code AS voucher
            FROM bill b
            LEFT JOIN account emp ON emp.id = b.account_id
            LEFT JOIN account cus ON cus.id = b.customer_id
            LEFT JOIN voucher v ON v.id = b.voucher_id
            WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%
            OR b.customer_name LIKE %:#{#req.code}% OR b.phone_number LIKE %:#{#req.code}%)
            AND ((:#{#req.idStaff} IS NULL OR b.account_id = :#{#req.idStaff}) OR (b.account_id is null ))
            AND (:#{#req.status} IS NULL OR b.status = :#{#req.status})
            AND (:#{#req.idCustomer} IS NULL OR b.customer_id = :#{#req.idCustomer})
            AND (:#{#req.fromDate} IS NULL OR :#{#req.toDate} IS NULL OR (b.update_at BETWEEN :#{#req.fromDate} AND :#{#req.toDate}))
            AND b.deleted = FALSE AND b.status NOT IN (1)
            """, nativeQuery = true)
    Page<BillResponse> getAll(@Param("req") BillSearchRequest request, Pageable pageable);

    @Query(value = """
           SELECT
           CASE
               WHEN status = 2 THEN 'Chờ xác nhận'
               WHEN status = 3 THEN 'Xác nhận thông tin thanh toán'
               WHEN status = 4 THEN 'Chờ giao'
               WHEN status = 5 THEN 'Đang giao'
               WHEN status = 6 THEN 'Hoàn thành'
               WHEN status = 7 THEN 'Đã hủy'
               WHEN status = 8 THEN 'Hoàn 1 phần'
               ELSE 'Chờ thanh toán'
           END AS statusName,
           status as status,
           COUNT(*) AS totalCount
           FROM bill b
           WHERE b.status NOT IN (1)
           GROUP BY status
           ORDER BY status
            """,nativeQuery = true)
    List<StatisticBillStatus> statisticBillStatus();

    @Query("""
            SELECT b
            FROM Bill b
            WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%)
            AND (:#{#req.idStaff} IS NULL OR b.account.id = :#{#req.idStaff})
            AND (:#{#req.status} IS NULL OR b.status = :#{#req.status})
            AND b.deleted = FALSE 
            AND b.status = 1
            ORDER BY b.createAt DESC
            """)
    List<Bill> getNewBill(@Param("req") BillSearchRequest request);

    Bill findByCode(String code);

    Boolean existsByCode(String code);

    Page<Bill> findByAccountIdAndStatusAndDeletedFalse(Long idAccount, Integer status, Pageable pageable);

    @Query(value = """
                SELECT
                    COUNT(DISTINCT b.id) AS totalBillToday,
                    SUM(b.total_money) AS totalBillAmountToday
                FROM bill b JOIN bill_detail bd ON b.id = bd.bill_id
                WHERE b.receive_date >= :startOfDay AND b.receive_date <= :endOfDay 
                AND b.status IN ('8', '6')                   
                          """, nativeQuery = true)
    List<StatisticalDayResponse> getAllStatisticalDay(@Param("startOfDay") Long startOfDay,
                                                      @Param("endOfDay") Long endOfDay);

    @Query(value = """
            SELECT
                COUNT(DISTINCT b.id) AS totalBill,
                SUM(b.total_money) AS totalBillAmount,
                SUM(bd.quantity) AS totalProduct
            FROM bill b JOIN bill_detail bd ON b.id = bd.bill_id
            WHERE b.status IN ('8', '6') AND b.receive_date >= :startOfMonth AND b.receive_date <= :endOfMonth
              """, nativeQuery = true)
    List<StatisticalMonthlyResponse> getAllStatisticalMonthly(@Param("startOfMonth") Long startOfMonth,
                                                              @Param("endOfMonth") Long endOfMonth);
}
