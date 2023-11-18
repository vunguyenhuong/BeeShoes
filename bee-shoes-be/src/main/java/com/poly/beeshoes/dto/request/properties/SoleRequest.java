package com.poly.beeshoes.dto.request.properties;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SoleRequest extends PageableRequest {
    private Long id;
    @NotEmpty(message = "Tên đế giày không được để trống!")
    private String name;
    private Boolean status;
}
