package com.poly.beeshoes.infrastructure.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PaymentMethodResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();
    Integer getMethod();
    BigDecimal getTotalMoney();
    String getNote();
    String getTradingCode();
    LocalDateTime getCreateAt();
}
