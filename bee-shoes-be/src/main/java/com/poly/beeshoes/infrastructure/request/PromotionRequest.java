package com.poly.beeshoes.infrastructure.request;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PromotionRequest extends PageableRequest {
    private Long id;
    private String code;
    private String name;
    private BigDecimal value;
    private Boolean type;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer status;
}
