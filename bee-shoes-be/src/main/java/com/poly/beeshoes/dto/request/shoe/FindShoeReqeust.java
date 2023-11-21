package com.poly.beeshoes.dto.request.shoe;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class FindShoeReqeust extends PageableRequest {
    private Long id;
    private String name;
    private String color;
    private String size;
    private String sole;
    private String brand;
    private String category;
    private List<String> brands;
    private List<String> categories;

    private List<String> colors;
    private List<String> sizes;
    private List<String> soles;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean status;
}
