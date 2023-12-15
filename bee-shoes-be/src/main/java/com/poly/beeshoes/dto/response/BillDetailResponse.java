package com.poly.beeshoes.dto.response;

import com.poly.beeshoes.entity.BillDetail;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {BillDetail.class})
public interface BillDetailResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getName();

    String getShoeCode();

    String getColor();

    String getSize();

    String getSole();

    BigDecimal getPrice();

    BigDecimal getDiscountPercent();

    BigDecimal getDiscountValue();
    BigDecimal getShoePrice();

    Integer getQuantity();
    Double getWeight();

    String getImages();

    BigDecimal getTotalMoney();
    Boolean getStatus();
}
