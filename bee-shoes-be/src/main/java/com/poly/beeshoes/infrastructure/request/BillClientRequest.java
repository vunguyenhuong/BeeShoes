package com.poly.beeshoes.infrastructure.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class BillClientRequest {
    private Long account;
    private Long voucher;
    private String customerName;
    private String email;
    private String district;
    private String province;
    private String ward;
    private String specificAddress;
    private BigDecimal moneyShip;
    private BigDecimal moneyReduce;
    private BigDecimal totalMoney;
    private String note;
    private Integer paymentMethod;
    private List<CartClientRequest> carts;
}
