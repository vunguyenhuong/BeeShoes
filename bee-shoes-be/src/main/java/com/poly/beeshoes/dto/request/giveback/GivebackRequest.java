package com.poly.beeshoes.dto.request.giveback;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GivebackRequest {
    private Long billDetail;
    private Integer quantity;
    private String note;
}
