package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.BillDetail;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;

@Projection(types = {BillDetail.class})
public interface BillDetailResponse {
    Long getId();

    BigDecimal getPrice();

    Integer getQuantity();

    BillResponse getBill();

    ShoeDetailResponse getShoeDetail();
}
