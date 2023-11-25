package com.poly.beeshoes.repository;

import com.poly.beeshoes.dto.request.shoe.FindShoeReqeust;
import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.dto.request.shoe.ShoeRequest;
import com.poly.beeshoes.dto.response.ShoeResponse;
import com.poly.beeshoes.dto.response.promotion.ShoePromotionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IShoeRepository extends JpaRepository<Shoe, Long> {
    Boolean existsByNameIgnoreCase(String name);

    @Query(value = """
            SELECT
            s.id AS id,s.name AS name,
            ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
            GROUP_CONCAT(DISTINCT c.name) AS color,
            GROUP_CONCAT(DISTINCT sz.name) AS size,
            SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.name ORDER BY img.name), ',', 1) AS images,
            s.description AS description,
            SUM(sd.quantity) AS quantity,
            ct.name AS category,
            br.name AS brand,
            MAX(sd.price) AS maxPrice,
            MIN(sd.price) AS minPrice,
            MIN(pmd.promotion_price) AS discountValue,
            s.deleted AS status
            FROM shoe s
            LEFT JOIN shoe_detail sd ON s.id = sd.shoe_id
            LEFT JOIN color c ON c.id = sd.color_id
            LEFT JOIN size sz ON sz.id = sd.size_id
            LEFT JOIN category ct ON ct.id = s.category_id
            LEFT JOIN brand br ON br.id = s.brand_id
            LEFT JOIN (SELECT shoe_detail_id, 
            GROUP_CONCAT(DISTINCT name) AS name FROM images GROUP BY shoe_detail_id
            ) img ON sd.id = img.shoe_detail_id
            LEFT JOIN promotion_detail pmd ON pmd.shoe_detail_id = sd.id
            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
            
            AND (:#{#req.color} IS NULL OR :#{#req.color} = '' OR sd.color_id IN (:#{#req.colors}))
            AND (:#{#req.size} IS NULL OR :#{#req.size} = '' OR sd.size_id IN (:#{#req.sizes}))
            AND (:#{#req.sole} IS NULL OR :#{#req.sole} = '' OR sd.sole_id IN (:#{#req.soles}))
            AND (:#{#req.brand} IS NULL OR :#{#req.brand} = '' OR s.brand_id IN (:#{#req.brands}))
            AND (:#{#req.category} IS NULL OR :#{#req.category} = '' OR s.category_id IN (:#{#req.categories}))
            GROUP BY s.id
            HAVING (:#{#req.minPrice} IS NULL OR :#{#req.maxPrice} IS NULL OR (MIN(sd.price) BETWEEN :#{#req.minPrice} AND :#{#req.maxPrice}))
            """, nativeQuery = true)
    Page<ShoeResponse> getAllShoe(@Param("req") FindShoeReqeust request, Pageable pageable);

    @Query(value = """
            SELECT
            s.id AS id,s.name AS name,
            ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
            ct.name AS category,
            br.name AS brand,
            pm.id AS discount
            FROM shoe s
            LEFT JOIN shoe_detail sd ON s.id = sd.shoe_id
            LEFT JOIN category ct ON ct.id = s.category_id
            LEFT JOIN brand br ON br.id = s.brand_id
            LEFT JOIN promotion_detail pmd ON pmd.shoe_detail_id = sd.id
            LEFT JOIN promotion pm ON pm.id = pmd.promotion_id
            WHERE (:promotion IS NULL OR pm.id = :promotion)
            """, nativeQuery = true)
    List<ShoePromotionResponse> getAllShoeInPromotion(@Param("promotion") Long promotion);

    @Query(value = """
            SELECT
            s.id AS id,s.name AS name,
            ROW_NUMBER() OVER(ORDER BY SUM(bd.quantity) DESC) AS indexs,
            SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.name ORDER BY img.name), ',', 1) AS images,
            ct.name AS category,
            br.name AS brand,
            MAX(sd.price) AS maxPrice,
            MIN(sd.price) AS minPrice,
            SUM(bd.quantity) AS quantitySold,
            s.deleted AS status
            FROM shoe s
            LEFT JOIN shoe_detail sd ON s.id = sd.shoe_id
            LEFT JOIN category ct ON ct.id = s.category_id
            LEFT JOIN brand br ON br.id = s.brand_id
            LEFT JOIN (SELECT shoe_detail_id, 
            GROUP_CONCAT(DISTINCT name) AS name FROM images GROUP BY shoe_detail_id
            ) img ON sd.id = img.shoe_detail_id
            LEFT JOIN bill_detail bd ON bd.shoe_detail_id = sd.id
            LEFT JOIN bill b ON b.id = bd.bill_id
            WHERE s.deleted = FALSE AND b.status = 6
            GROUP BY s.id
            ORDER BY SUM(bd.quantity) DESC
            LIMIT :top
            """, nativeQuery = true)
    List<ShoeResponse> topSell(@Param("top") Integer top);
}