package com.poly.beeshoes.dto.request.bill;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class BillRequest extends PageableRequest {
    private Long id;
    private String code;
    private Long account;
    private Long voucher;
    private Long customer;
    private Integer type;
    private String customerName;
    private String phoneNumber;
    private String address;
    private BigDecimal moneyShip;
    private BigDecimal moneyReduce;
    private BigDecimal totalMoney;
    private String note;
    private Integer status;
    private Integer paymentMethod;
    private BigDecimal tienMat;
    private BigDecimal tienChuyenKhoan;
    private String email;
    private String tradingCode;
    private Boolean waitPay;
}
