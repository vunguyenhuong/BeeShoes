package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.infrastructure.request.ShoeDetailRequest;
import com.poly.beeshoes.infrastructure.request.shoedetail.FindShoeDetailRequest;
import com.poly.beeshoes.infrastructure.response.ShoeDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface IShoeDetailRepository extends JpaRepository<ShoeDetail, Long> {
    ShoeDetail findByCode(String code);

    @Query(value = """
            SELECT
                sd.id AS id,
                ROW_NUMBER() OVER(ORDER BY s.update_at DESC) AS indexs,
                CONCAT(s.name, ' [', c.name, ' - ', sz.name, ']') AS name,
                sd.code AS code,
                sl.name AS sole,
                c.name AS color,
                sz.name AS size,
                sd.quantity AS quantity,
                sd.weight AS weight,
                CASE
                    WHEN MAX(pm.value) IS NOT NULL THEN sd.price - sd.price / 100 * MAX(pm.value)
                    ELSE sd.price
                END AS price,
                MAX(pm.value) AS discountPercent,
                GROUP_CONCAT(DISTINCT img.name) AS images,
                sd.deleted AS status
            FROM
                shoe_detail sd
                LEFT JOIN shoe s ON sd.shoe_id = s.id
                LEFT JOIN color c ON sd.color_id = c.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN sole sl ON sd.sole_id = sl.id
                LEFT JOIN images img ON img.shoe_detail_id = sd.id
                LEFT JOIN promotion_detail pmd ON pmd.shoe_detail_id = sd.id
                LEFT JOIN promotion pm ON pm.id = pmd.promotion_id
            WHERE
                (:#{#req.shoe} IS NULL OR sd.shoe_id IN (:#{#req.shoes}))
                AND (:#{#req.color} IS NULL OR sd.color_id IN (:#{#req.colors}))
                AND (:#{#req.size} IS NULL OR sd.size_id IN (:#{#req.sizes}))
                AND (:#{#req.sole} IS NULL OR sd.sole_id IN (:#{#req.soles}))
                AND (:#{#req.name} IS NULL OR CONCAT(s.name, ' ', c.name, ' ', sz.name, ' ') LIKE %:#{#req.name}%)
                
            GROUP BY
                sd.id, s.update_at, s.name, c.name, sz.name, sd.code, sl.name, sd.quantity, sd.weight, sd.price, sd.deleted;
            """, nativeQuery = true)
    Page<ShoeDetailResponse> getAll(@Param("req") FindShoeDetailRequest request, Pageable pageable);
    ShoeDetail findByShoeIdAndColorIdAndSizeId(Long idShoe, Long idColor, Long idSize);

    ShoeDetail findByShoeIdAndColorNameAndSizeName(Long idShoe, String colorName, String sizeName);
}
