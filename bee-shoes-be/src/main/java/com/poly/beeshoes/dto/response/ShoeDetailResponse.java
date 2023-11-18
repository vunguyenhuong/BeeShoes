package com.poly.beeshoes.dto.response;

import com.poly.beeshoes.entity.ShoeDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {ShoeDetail.class})
public interface ShoeDetailResponse {
    Long getId();
    @Value("#{target.indexs}")
    Integer getIndex();

    String getCode();
    String getName();

    String getSole();

    String getColor();

    String getSize();
    BigDecimal getDiscountPercent();
    BigDecimal getDiscountValue();

    Integer getQuantity();

    BigDecimal getPrice();

    Double getWeight();

    String getImages();
    Boolean getStatus();
}
