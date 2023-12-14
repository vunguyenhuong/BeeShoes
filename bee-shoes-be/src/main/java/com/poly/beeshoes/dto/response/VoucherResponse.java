package com.poly.beeshoes.dto.response;

import com.poly.beeshoes.entity.Voucher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Projection(types = {Voucher.class})
public interface VoucherResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getCode();

    String getName();

    Integer getQuantity();

    Float getPercentReduce();

    BigDecimal getMinBillValue();

    Integer getStatus();

    LocalDateTime getStartDate();

    LocalDateTime getEndDate();

    String getCustomer();

    Boolean getType();
}

