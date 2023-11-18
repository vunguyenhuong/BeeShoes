package com.poly.beeshoes.dto.request;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest extends PageableRequest {
    private Long account;
    private String name;
    private String phoneNumber;
    private String specificAddress;
    private String ward;
    private String district;
    private String province;
    private Boolean defaultAddress;
    private Boolean status;
}
