package com.poly.beeshoes.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PaymentMethodResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    Integer getMethod();

    BigDecimal getTotalMoney();
    Boolean getType();

    String getNote();

    String getTradingCode();

    LocalDateTime getCreateAt();

    String getCreateBy();
}
