package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Voucher;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Voucher.class})
public interface VoucherResponse {
    Long getId();
    String getCode();
}

