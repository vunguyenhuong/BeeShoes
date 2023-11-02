package com.poly.beeshoes.infrastructure.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartClientRequest {
    private Long id;
    private Integer quantity;
}
