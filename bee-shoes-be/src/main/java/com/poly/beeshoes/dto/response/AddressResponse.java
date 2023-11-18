package com.poly.beeshoes.dto.response;

import com.poly.beeshoes.entity.Address;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Address.class})
public interface AddressResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();

    String getName();

    String getPhoneNumber();

    String getWard();

    String getDistrict();

    String getProvince();

    String getSpecificAddress();

    Boolean getDefaultAddress();

    Boolean getStatus();

}
