package com.poly.beeshoes.dto.response;

import com.poly.beeshoes.entity.Shoe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {Shoe.class})
public interface ShoeResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getName();

    String getSize();

    String getColor();

    String getBrand();

    String getCategory();

    Integer getQuantity();

    Boolean getStatus();
    BigDecimal getMaxPrice();
    BigDecimal getMinPrice();
    String getDescription();
    String getImages();

    Integer getQuantitySold();
    BigDecimal getDiscountValue();
}
