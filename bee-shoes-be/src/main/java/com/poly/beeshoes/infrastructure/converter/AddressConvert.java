package com.poly.beeshoes.infrastructure.converter;

import com.poly.beeshoes.entity.Address;
import com.poly.beeshoes.infrastructure.request.AddressRequest;
import org.springframework.stereotype.Component;

@Component
public class AddressConvert {
    public Address convertRequestToEntity(AddressRequest request) {
        return Address.builder()
                .name(request.getName()).defaultAddress(request.getDefaultAddress())
                .ward(request.getWard()).district(request.getDistrict())
                .phoneNumber(request.getPhoneNumber())
                .province(request.getProvince())
                .specificAddress(request.getSpecificAddress())
                .build();
    }
}
