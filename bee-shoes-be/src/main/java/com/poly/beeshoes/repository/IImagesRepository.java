package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Color;
import com.poly.beeshoes.entity.Images;
import com.poly.beeshoes.entity.Shoe;
import com.poly.beeshoes.infrastructure.response.ImageResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IImagesRepository extends JpaRepository<Images, Long> {
    List<ImageResponse> findByShoeDetailIdAndDeletedFalse(Long idShoeDetail);

    List<Images> findByShoeDetailShoeAndShoeDetailColorAndDeletedFalse(Shoe shoe, Color color);
}
