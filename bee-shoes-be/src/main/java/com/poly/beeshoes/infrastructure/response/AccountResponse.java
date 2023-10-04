package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Account;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Account.class})
public interface AccountResponse {
    Long getId();
    String getName();
    String getPhoneNumber();


}
