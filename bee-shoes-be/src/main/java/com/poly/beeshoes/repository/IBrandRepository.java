package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Brand;
import com.poly.beeshoes.dto.request.properties.BrandRequest;
import com.poly.beeshoes.dto.response.BrandResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IBrandRepository extends JpaRepository<Brand, Long> {
    Boolean existsByNameIgnoreCaseAndNameNot(String name, String exceptName);

    Boolean existsByNameIgnoreCase(String name);

    //    @Query("""
//            SELECT b.id as id,b.name as name FROM Brand b
//            WHERE (:name IS NULL OR b.name LIKE %:name%)
//            AND (:status IS NULL OR b.deleted = :status)
//            ORDER BY b.createAt
//            """)
//    Page<BrandResponse> getAll(@Param("name") String name, @Param("status") Boolean status, Pageable pageable);
    @Query(value = """
            SELECT
            b.id AS id,
            b.name AS name,
            b.create_at AS createAt,
            ROW_NUMBER() OVER(ORDER BY b.create_at DESC) AS indexs,
            b.deleted AS status
            FROM brand b
            LEFT JOIN shoe_detail sd ON b.id  = sd.size_id
            WHERE (:#{#req.name} IS NULL OR b.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR b.deleted = :#{#req.status})
            GROUP BY b.id
            """, nativeQuery = true)
    Page<BrandResponse> getAllBrand(@Param("req") BrandRequest request, Pageable pageable);
}
