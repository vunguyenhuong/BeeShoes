package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.infrastructure.response.BrandResponse;
import com.poly.beeshoes.infrastructure.response.ColorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IColorRepository extends JpaRepository<Color, Long> {
    Boolean existsByNameIgnoreCaseAndNameNot(String name, String exceptName);

    @Query("""
            SELECT b.id as id,b.name as name FROM Color b
            WHERE (:name IS NULL OR b.name LIKE %:name%)
            AND (:status IS NULL OR b.deleted = :status)
            ORDER BY b.createAt
            """)
    Page<ColorResponse> getAll(@Param("name") String name, @Param("status") Boolean status, Pageable pageable);
}
