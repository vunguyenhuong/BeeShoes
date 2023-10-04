package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.BillDetail;
import com.poly.beeshoes.infrastructure.request.BillDetailRequest;
import com.poly.beeshoes.infrastructure.response.BillDetailResponse;
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

    BillDetail findByShoeDetailCodeAndBillId(String codeShoeDetail, Long idBill);

    Boolean existsByShoeDetailIdAndBillId(Long idShoeDetail, Long idBill);

    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
            bd.id AS id,
            CONCAT(s.name, ' [', c.name, ' - ', sz.name, ']') AS name,
            sd.code AS shoeCode,
            sl.name AS sole,
            c.name AS color,
            sz.name AS size,
            bd.quantity AS quantity,
            bd.price AS price,
            GROUP_CONCAT(DISTINCT img.name) AS images
            FROM bill_detail bd
            JOIN shoe_detail sd ON sd.id = bd.shoe_detail_id
            JOIN shoe s ON s.id = sd.shoe_id
            JOIN color c ON sd.color_id = c.id
            JOIN size sz ON sd.size_id = sz.id
            JOIN sole sl ON sd.sole_id = sl.id
            LEFT JOIN (SELECT shoe_detail_id, 
            GROUP_CONCAT(DISTINCT name) AS name FROM images GROUP BY shoe_detail_id
            ) img ON sd.id = img.shoe_detail_id
            WHERE bd.bill_id = :#{#req.bill}
            GROUP BY bd.id
            """, nativeQuery = true)
    Page<BillDetailResponse> getAllBillDetail(@Param("req") BillDetailRequest request, Pageable pageable);
}
