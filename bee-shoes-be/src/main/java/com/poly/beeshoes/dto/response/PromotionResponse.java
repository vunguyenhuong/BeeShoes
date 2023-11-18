package com.poly.beeshoes.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PromotionResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();
    String getCode();
    String getName();
    BigDecimal getValue();
    Boolean getType();
    LocalDateTime getStartDate();
    LocalDateTime getEndDate();
    Integer getStatus();
}
