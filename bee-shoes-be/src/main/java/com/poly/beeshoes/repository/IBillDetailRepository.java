package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Bill;
import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.dto.request.billdetail.BillDetailRequest;
import com.poly.beeshoes.dto.response.BillDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    List<BillDetail> findByBillAndStatus(Bill bill, Boolean status);

    BillDetail findByShoeDetailCodeAndBillIdAndStatus(String codeShoeDetail, Long idBill, Boolean status);

    Boolean existsByShoeDetailIdAndBillIdAndStatus(Long idShoeDetail, Long idBill, Boolean status);

    @Query(value = """
            SELECT
                ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
                bd.id AS id,
                CONCAT(s.name, ' [', c.name, ' - ', sz.name, ']') AS name,
                sd.code AS shoeCode,
                sl.name AS sole,
                c.name AS color,
                sz.name AS size,
                bd.quantity AS quantity,
                sd.weight AS weight,
                bd.price AS price,
                sd.price AS shoePrice,
                CASE
                    WHEN pm.status = 1
                        THEN pmd.promotion_price
                    ELSE NULL
                END AS discountValue,
                CASE
                    WHEN pm.status = 1
                        THEN MAX(pm.value)
                    ELSE NULL
                END AS discountPercent,
                GROUP_CONCAT(DISTINCT img.name) AS images,
                bd.status AS status
            FROM
                bill_detail bd
                JOIN shoe_detail sd ON sd.id = bd.shoe_detail_id
                JOIN shoe s ON s.id = sd.shoe_id
                JOIN color c ON sd.color_id = c.id
                JOIN size sz ON sd.size_id = sz.id
                JOIN sole sl ON sd.sole_id = sl.id
                LEFT JOIN (SELECT shoe_detail_id, GROUP_CONCAT(DISTINCT name) AS name FROM images GROUP BY shoe_detail_id) img ON sd.id = img.shoe_detail_id
                LEFT JOIN promotion_detail pmd ON pmd.shoe_detail_id = sd.id
                LEFT JOIN promotion pm ON pm.id = pmd.promotion_id
            WHERE
                bd.bill_id = :#{#req.bill}
                AND :#{#req.status} IS NULL OR bd.status = :#{#req.status}
            GROUP BY
                bd.id,pmd.promotion_price,pm.status
            """, nativeQuery = true)
    Page<BillDetailResponse> getAllBillDetail(@Param("req") BillDetailRequest request, Pageable pageable);
}
