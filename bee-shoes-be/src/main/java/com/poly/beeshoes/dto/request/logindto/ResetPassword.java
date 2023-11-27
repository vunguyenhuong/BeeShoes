package com.poly.beeshoes.dto.request.logindto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResetPassword {

    private  String emailForgot ;

    private String phoneNumber;
}
