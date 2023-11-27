package com.poly.beeshoes.dto.response;

import org.springframework.beans.factory.annotation.Value;

public interface BillGiveBackInformationResponse {

    @Value("#{target.idBill}")
    String getIdBill();

    @Value("#{target.idEmployee}")
    String getIdEmployee();

    @Value("#{target.idAccount}")
    String getIdAccount();

    @Value("#{target.codeBill}")
    String getCodeBill();

    @Value("#{target.nameCustomer}")
    String getNameCustomer();


    @Value("#{target.phoneNumber}")
    String getPhoneNumber();


    @Value("#{target.statusBill}")
    String getStatusBill();

    @Value("#{target.typeBill}")
    String getTypeBill();

    @Value("#{target.address}")
    String getAddress();

    @Value("#{target.note}")
    String getNote();
}
