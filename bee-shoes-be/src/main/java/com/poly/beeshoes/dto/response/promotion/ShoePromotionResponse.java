package com.poly.beeshoes.dto.response.promotion;

import com.poly.beeshoes.entity.Shoe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Shoe.class})
public interface ShoePromotionResponse {
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
    Integer getDiscount();
}
