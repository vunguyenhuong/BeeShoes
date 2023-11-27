package com.poly.beeshoes.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBillGiveBack {

    private long idBill;

    private String idAccount;

    private String note;

    private BigDecimal totalBillGiveBack;
}
