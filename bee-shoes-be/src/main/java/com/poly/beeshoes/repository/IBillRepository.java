package com.poly.beeshoes.repository;

import com.poly.beeshoes.dto.response.BillGiveBackInformationResponse;
import com.poly.beeshoes.dto.response.BillProductGiveback;
import com.poly.beeshoes.dto.response.StatisticalDayResponse;
import com.poly.beeshoes.dto.response.StatisticalMonthlyResponse;
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
            WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%)
            AND ((:#{#req.idStaff} IS NULL OR b.account_id = :#{#req.idStaff}) OR (b.account_id is null ))
            AND (:#{#req.status} IS NULL OR b.status = :#{#req.status})
            AND (:#{#req.idCustomer} IS NULL OR b.customer_id = :#{#req.idCustomer})
            AND b.deleted = FALSE 
            """, nativeQuery = true)
    Page<BillResponse> getAll(@Param("req") BillSearchRequest request, Pageable pageable);

    @Query(value = """
            SELECT
                       CASE
                           WHEN status = 1 THEN 'Tạo đơn hàng'
                           WHEN status = 2 THEN 'Chờ xác nhận'
                           WHEN status = 3 THEN 'Xác nhận thông tin thanh toán'
                           WHEN status = 4 THEN 'Chờ giao'
                           WHEN status = 5 THEN 'Đang giao'
                           WHEN status = 6 THEN 'Hoàn thành'
                           WHEN status = 7 THEN 'Đã hủy'
                           ELSE 'Chờ thanh toán'
                       END AS statusName,
                       status as status,
                       COUNT(*) AS totalCount
                   FROM
                       bill
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
            ORDER BY b.createAt DESC
            """)
    Page<Bill> getAllBill(@Param("req") BillSearchRequest request, Pageable pageable);

    Boolean existsByCode(String code);

    Page<Bill> findByAccountIdAndStatusAndDeletedFalse(Long idAccount, Integer status, Pageable pageable);

    @Query(value = """
            SELECT
                bi.id AS idBill,
                bi.code AS codeBill,
                bi.customer_name AS nameCustomer,
                bi.phone_number AS phoneNumber,
                bi.status AS statusBill,
                bi.type AS typeBill,
                bi.address AS address,
                bi.note AS note,
                ac.id AS idAccount,
                em.id AS idEmployee
            FROM bill bi
            LEFT JOIN account ac ON ac.id = bi.customer_id
            LEFT JOIN account em ON em.id = bi.account_id
            WHERE bi.code = :codeBill
                        """, nativeQuery = true)
    BillGiveBackInformationResponse getBillGiveBackInformation(@Param("codeBill") String codeBill);


    @Query(value = """
            SELECT
                ROW_NUMBER() OVER (ORDER BY detail.id DESC) AS stt,
                bd.id AS idBillDetail,
                detail.id AS idProductDetail,
                images.name AS image,
                CONCAT(p.name ,'[ ',s2.name,' - ',c2.name,' ]') AS nameProduct,
                bd.quantity AS quantity,
                bd.price AS price,
                c2.name AS codeColor,
                bd.status AS statusBillDetail
            FROM bill bi
            JOIN bill_detail bd ON bi.id = bd.bill_id
            JOIN shoe_detail detail ON bd.shoe_detail_id = detail.id
            JOIN shoe p ON detail.shoe_id = p.id
            JOIN (
                SELECT shoe_detail_id, MAX(id) AS max_image_id
                FROM images
                GROUP BY shoe_detail_id
            ) max_images ON detail.id = max_images.shoe_detail_id
            LEFT JOIN  images ON max_images.max_image_id = images.id
            JOIN size s2 on detail.size_id = s2.id
            JOIN color c2 on detail.color_id = c2.id
            WHERE bi.id = :idBill
                        """, nativeQuery = true)
    List<BillProductGiveback> getBillGiveBack(@Param("idBill") String idBill);


    @Query(value = """
            SELECT
                COUNT(id) AS totalBillToday,
                SUM(total_money) AS totalBillAmountToday
            FROM bill
            WHERE
                receive_date >= :startOfDay AND receive_date <= :endOfDay 
                AND bill.status IN ('8', '6')                       
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
