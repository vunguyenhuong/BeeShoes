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
public class UpdateBillDetailGiveBack {

    private String idBillDetail;

    private String idProduct;

    private String price;

    private String promotion;

    private int quantity;

    private BigDecimal totalPrice;
}
