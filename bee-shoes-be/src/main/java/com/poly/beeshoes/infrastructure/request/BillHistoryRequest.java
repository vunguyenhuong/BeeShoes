package com.poly.beeshoes.infrastructure.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillHistoryRequest {
    private Long idBill;
    private String note;
    private Integer status;
}
