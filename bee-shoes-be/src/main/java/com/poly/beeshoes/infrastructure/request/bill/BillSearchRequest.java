package com.poly.beeshoes.infrastructure.request.bill;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillSearchRequest extends PageableRequest {
    private Long idStaff;
    private Integer status;
    private String code;
}
