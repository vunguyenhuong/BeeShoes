package com.poly.beeshoes.infrastructure.request;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BillDetailRequest extends PageableRequest {
    private Long id;
    @NotNull(message = "Số lượng không được để trống!")
    private BigDecimal price;
    @NotNull(message = "Đơn giá không được để trống!")
    private Integer quantity;
    @NotNull(message = "Vui lòng chọn hóa đơn")
    private Long bill;
    private Long shoeDetail;

    //fillter
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String code;

}
