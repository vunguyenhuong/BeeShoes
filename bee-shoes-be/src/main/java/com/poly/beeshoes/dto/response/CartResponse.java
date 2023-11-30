package com.poly.beeshoes.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface CartResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();
    Long getIdProductDetail();
    String getName();
    String getImage();
    String getSole();
    BigDecimal getPrice();
    BigDecimal getDiscountValue();
    BigDecimal getDiscountPercent();
    Integer getQuantity();
}
