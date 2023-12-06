package com.poly.beeshoes.dto.request.bill;

import com.poly.beeshoes.entity.Address;
import com.poly.beeshoes.entity.BillDetail;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillUpdateRequest {
    private BillDetail billDetail;
    private Integer quantity;
    private String address;
    private Boolean isDeleted;
}
