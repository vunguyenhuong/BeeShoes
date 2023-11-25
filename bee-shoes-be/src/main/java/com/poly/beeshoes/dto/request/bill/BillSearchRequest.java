package com.poly.beeshoes.dto.request.bill;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillSearchRequest extends PageableRequest {
    private Long idStaff;
    private Long idCustomer;
    private Integer status;
    private String code;
    private Boolean deleted;
}
