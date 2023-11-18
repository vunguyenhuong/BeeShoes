package com.poly.beeshoes.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillHistoryRequest {
    private Long idBill;
    private String note;
    private Integer status;
}
