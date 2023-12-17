package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.dto.request.properties.ColorRequest;
import com.poly.beeshoes.dto.response.ColorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IColorRepository extends JpaRepository<Color, Long> {
    Color findByName(String name);
    Boolean existsByNameIgnoreCaseAndNameNot(String name, String exceptName);
    Boolean existsByNameIgnoreCase(String name);

//    @Query("""
//            SELECT b.id as id,b.name as name FROM Color b
//            WHERE (:name IS NULL OR b.name LIKE %:name%)
//            AND (:status IS NULL OR b.deleted = :status)
//            ORDER BY b.createAt
//            """)
@Query(value = """
            SELECT
            c.id AS id,
            c.name AS name,
            c.create_at AS createAt,
            ROW_NUMBER() OVER(ORDER BY c.create_at DESC) AS indexs,
            c.deleted AS status
            FROM color c
            LEFT JOIN shoe_detail sd ON c.id = sd.size_id
            WHERE (:#{#req.name} IS NULL OR c.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR c.deleted = :#{#req.status})
            GROUP BY c.id
            """, nativeQuery = true)
    Page<ColorResponse> getAllColor(@Param("req") ColorRequest request, Pageable pageable);
}
