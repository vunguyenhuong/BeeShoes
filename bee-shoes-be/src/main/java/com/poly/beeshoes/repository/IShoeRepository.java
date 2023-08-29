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

@Repository
public interface IShoeRepository extends JpaRepository<Shoe, Long> {
    Boolean existsByNameIgnoreCase(String name);

    @Query("""
            SELECT s.id AS id,
            s.name AS name,
            s.brand AS brand,
            s.category AS category,
            SUM(sd.quantity) AS quantity 
            FROM Shoe s LEFT JOIN s.shoeDetails sd 
            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
            AND (:#{#req.brand} IS NULL OR s.brand.id = :#{#req.brand})
            AND (:#{#req.category} IS NULL OR s.category.id = :#{#req.category})
            GROUP BY s.id, s.name, s.brand, s.category,s.updateAt
            ORDER BY s.updateAt DESC
            """)
    Page<ShoeResponse> getAllShoe(@Param("req") ShoeRequest request, Pageable pageable);

}
