package com.poly.beeshoes.infrastructure.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentMethodRequest {
    private Long bill;
    private Integer method;
    private BigDecimal totalMoney;
    private String note;
    private String tradingCode;
}
