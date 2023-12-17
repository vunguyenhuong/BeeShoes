package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Sole;
import com.poly.beeshoes.dto.request.properties.SoleRequest;
import com.poly.beeshoes.dto.response.SoleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ISoleRepository extends JpaRepository<Sole, Long> {
    Sole findByName(String name);
    Boolean existsByNameIgnoreCaseAndNameNot(String name, String exceptName);
    Boolean existsByNameIgnoreCase(String name);

//    @Query("""
//            SELECT b.id as id,b.name as name FROM Sole b
//            WHERE (:name IS NULL OR b.name LIKE %:name%)
//            AND (:status IS NULL OR b.deleted = :status)
//            ORDER BY b.createAt
//            """)
@Query(value = """
            SELECT
            s.id AS id,
            s.name AS name,
            s.create_at AS createAt,
            ROW_NUMBER() OVER(ORDER BY s.create_at DESC) AS indexs,
            s.deleted AS status
            FROM sole s
            LEFT JOIN shoe_detail sd ON s.id = sd.size_id
            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR s.deleted = :#{#req.status})
            GROUP BY s.id
            """, nativeQuery = true)
    Page<SoleResponse> getAllSole(@Param("req")SoleRequest request, Pageable pageable);
}
