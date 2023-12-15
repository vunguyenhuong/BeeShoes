package com.poly.beeshoes.dto.request.billdetail;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BillDetailRequest extends PageableRequest {
    private Long id;
    @NotNull(message = "Đơn giá không được để trống!")
    private Integer quantity;
    private BigDecimal price;
    private Long bill;
    private String shoeDetail;

    //fillter
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String code;

    private Boolean status;

}
