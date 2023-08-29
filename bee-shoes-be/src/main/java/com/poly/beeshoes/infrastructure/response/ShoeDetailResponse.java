package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.ShoeDetail;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.util.List;

@Projection(types = {ShoeDetail.class})
public interface ShoeDetailResponse {
    Long getId();

    String getCode();

    String getName();

    SoleResponse getSole();

    Integer getQuantity();

    BigDecimal getPrice();

    Double getWeight();

    List<ImageResponse> getImages();
}
