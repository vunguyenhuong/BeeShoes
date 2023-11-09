package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.infrastructure.request.ShoeRequest;
import com.poly.beeshoes.infrastructure.response.ShoeResponse;
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

//    @Query("""
//            SELECT ROW_NUMBER() OVER (ORDER BY s.updateAt DESC) AS index,
//            s.id AS id,
//            s.name AS name,
//            s.brand AS brand,
//            s.category AS category,
//            SUM(sd.quantity) AS quantity ,
//            s.deleted AS status
//            FROM Shoe s LEFT JOIN s.shoeDetails sd
//            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
//            AND (:#{#req.brand} IS NULL OR s.brand.id = :#{#req.brand})
//            AND (:#{#req.category} IS NULL OR s.category.id = :#{#req.category})
//            AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
//            GROUP BY s.id, s.name, s.brand, s.category,s.updateAt,s.deleted
//            ORDER BY s.updateAt DESC
//            """)
    @Query(value = """
            SELECT
            s.id AS id,s.name AS name,
            ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
            GROUP_CONCAT(DISTINCT (CONCAT('{ \"id\": \"', c.id, '\",\"name\": \"', c.name, '\"}'))) AS color,
            GROUP_CONCAT(DISTINCT (CONCAT('{ \"id\": \"', sz.id, '\",\"name\": \"', sz.name, '\"}'))) AS size,
            SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.name ORDER BY img.name), ',', 1) AS images,
            s.description AS description,
            SUM(sd.quantity) AS quantity,
            ct.name AS category,
            br.name AS brand,
            MAX(sd.price) AS maxPrice,
            MIN(sd.price) AS minPrice,
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
            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
            AND (:#{#req.brand} IS NULL OR s.brand_id = :#{#req.brand})
            AND (:#{#req.category} IS NULL OR s.category_id = :#{#req.category})
            AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
            GROUP BY s.id
            """, nativeQuery = true)
    Page<ShoeResponse> getAllShoe(@Param("req") ShoeRequest request, Pageable pageable);
}
