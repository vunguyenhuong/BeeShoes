package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.entity.Images;
import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.dto.response.ImageResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IImagesRepository extends JpaRepository<Images, Long> {
    @Query(value = """
            SELECT i.id AS id, i.name AS name FROM images i
            WHERE i.shoe_detail_id = :idShoeDetail
            """, nativeQuery = true)
    List<ImageResponse> getImagesByShoeDetail(@Param("idShoeDetail") Long idShoeDetail);
}
