package com.poly.beeshoes.dto.request.bill;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
public class BillSearchRequest extends PageableRequest {
    private Long idStaff;
    private Long idCustomer;
    private Integer status;
    private String code;
    private Boolean deleted;
    private Date fromDate;
    private Date toDate;
}
