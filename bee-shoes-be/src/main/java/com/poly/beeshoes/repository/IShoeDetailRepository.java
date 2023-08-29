package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.entity.Category;
import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.entity.ShoeDetail;
import com.poly.beeshoes.entity.Size;
import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.infrastructure.request.ShoeDetailRequest;
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

    @Query("""
            SELECT s FROM ShoeDetail s
            JOIN FETCH s.images
            WHERE
            (:#{#req.name} IS NULL OR CONCAT(s.shoe.name, ' ', s.color.name, '-', s.size.name) LIKE %:#{#req.name}%)
            AND (:#{#req.shoe} IS NULL OR s.shoe.id = :#{#req.shoe})
            AND (:#{#req.color} IS NULL OR s.color.id = :#{#req.color})
            AND (:#{#req.size} IS NULL OR s.size.id = :#{#req.size})
            AND (:#{#req.sole} IS NULL OR s.sole.id = :#{#req.sole})
            AND (:#{#req.minPrice} IS NULL OR :#{#req.maxPrice} IS NULL 
            OR s.price >= :#{#req.minPrice} AND s.price <= :#{#req.maxPrice})
            AND (:#{#req.deleted} IS NULL OR :#{#req.deleted} = '' OR s.deleted = :#{#req.deleted})
            ORDER BY s.createAt DESC
            """)
    Page<ShoeDetail> getAllShoeDetail(@Param("req") ShoeDetailRequest request,Pageable pageable);

    Boolean existsByShoeIdAndColorIdAndSizeIdAndSoleId(Long idShoe, Long idColor, Long idSize, Long idSole);

//    @Query("""
//            SELECT s FROM ShoeDetail s WHERE
//            (:color IS NULL OR s.color.id = :color)
//            AND (:shoe IS NULL OR s.shoe.id = :shoe)
//            AND (:size IS NULL OR s.size.id = :size)
//            AND (:sole IS NULL OR s.sole.id = :sole)
//            ORDER BY s.createAt DESC
//            """)
//    List<ShoeDetail> filterShoeDetailV1(@Param("shoe") Long shoe,
//                                        @Param("color") Long color,
//                                        @Param("size") Long size,
//                                        @Param("sole") Long sole);
//
//    List<ShoeDetail> findByShoeId(Long idShoe);
//
//    @Query("""
//            SELECT A FROM ShoeDetail A
//            WHERE A.shoe.id = :idShoe
//            """)
//    List<ShoeDetail> getListShoeDetail(@Param("idShoe") Long idShoe);
//
//    List<ShoeDetail> findByShoeIdAndColorIdAndDeletedFalse(Long idShoe, Long idColor);
//
//    List<ShoeDetail> findByShoeIdAndColorIdAndSizeIdAndDeletedFalse(Long idShoe, Long idColor, Long idSize);
//
//    @Query("""
//            SELECT A  FROM ShoeDetail A
//            WHERE CONCAT(A.shoe.name, ' ', A.color.name, ' - ', A.size.name) LIKE %:value%
//            AND A.quantity >= 1
//            """)
//    List<ShoeDetail> searchShoeDetail(@Param("value") String value);
}
