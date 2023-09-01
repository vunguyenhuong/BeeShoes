package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Bill;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Projection(types = {Bill.class})
public interface BillResponse {
    Long getId();

    String getCode();

    BigDecimal getTotalMoney();

    LocalDateTime getCreateAt();

    AccountResponse getAccount();

    Integer getType();

    Integer getStatus();

    VoucherResponse getVoucher();
}
