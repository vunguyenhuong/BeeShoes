package com.poly.beeshoes.infrastructure.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    private Long account;
    private String name;
    private String phoneNumber;
    private String specificAddress;
    private String ward;
    private String district;
    private String province;
    private Boolean defaultAddress;
}
