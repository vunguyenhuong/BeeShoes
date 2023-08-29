package com.poly.beeshoes.infrastructure.request;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShoeRequest extends PageableRequest {
    private Long id;
    @NotEmpty(message = "Tên không được để trống!")
    private String name;
    @NotNull(message = "Thương hiệu không được để trống!")
    private Long brand;
    @NotNull(message = "Danh mục không được để trống!")
    private Long category;
}
