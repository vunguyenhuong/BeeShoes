package com.poly.beeshoes.dto.request.properties;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SizeRequest extends PageableRequest {
    private Long id;
    @NotEmpty(message = "Số size không được để trống!")
    private String name;
    private Boolean status;
}
