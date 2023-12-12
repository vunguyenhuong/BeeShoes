package com.poly.beeshoes.dto.request.shoedetail;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class FindShoeDetailRequest extends PageableRequest {
    private Long id;
    private String shoe;
    private String color;
    private String size;
    private String sole;
    private List<String> shoes;
    private List<String> colors;
    private List<String> sizes;
    private List<String> soles;
    private Boolean deleted;
    private String name;
}
