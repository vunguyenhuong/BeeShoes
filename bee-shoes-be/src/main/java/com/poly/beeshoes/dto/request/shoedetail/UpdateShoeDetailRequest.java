package com.poly.beeshoes.dto.request.shoedetail;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateShoeDetailRequest {
    private Long shoe;
    @NotNull(message = "Vui lòng chọn màu sắc!")
    private String color;
    @NotNull(message = "Vui lòng chọn kích cỡ!")
    private String size;
    @NotNull(message = "Vui lòng chọn loại đế!")
    private String sole;
    @NotNull(message = "Số lượng không được để trống!")
    private Integer quantity;
    @NotNull(message = "Đơn giá không được để trống!")
    private BigDecimal price;
    @NotNull(message = "Cân nặng không được để trống!")
    private Double weight;
}
