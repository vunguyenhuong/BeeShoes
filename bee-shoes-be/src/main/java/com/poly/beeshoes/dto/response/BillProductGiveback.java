package com.poly.beeshoes.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface BillProductGiveback {

    @Value("#{target.stt}")
    Integer getSTT();

    @Value("#{target.idBillDetail}")
    String getIdBillDetail();

    @Value("#{target.image}")
    String getImage();

    @Value("#{target.idProductDetail}")
    String getIdProduct();

    @Value("#{target.nameProduct}")
    String getNameProduct();

    @Value("#{target.quantity}")
    Integer getQuantity();

    @Value("#{target.price}")
    BigDecimal getPrice();

    @Value("#{target.codeColor}")
    String getCodeColor();

    @Value("#{target.statusBillDetail}")
    String getStatusBillDetail();
}
