package com.poly.beeshoes.dto.response;

import com.poly.beeshoes.entity.Bill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Projection(types = {Bill.class})
public interface BillResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();

    String getCode();

    LocalDateTime getCreateAt();

    String getEmployee();

    String getCustomer();

    String getAddress();

    String getPhoneNumber();

    BigDecimal getTotalMoney();

    BigDecimal getMoneyShip();

    BigDecimal getMoneyReduce();

    LocalDateTime getPayDate();

    LocalDateTime getShipDate();

    LocalDateTime getDesiredDate();

    Long getReceiveDate();

    Integer getType();

    Integer getStatus();

    String getVoucher();

    String getNote();
}
