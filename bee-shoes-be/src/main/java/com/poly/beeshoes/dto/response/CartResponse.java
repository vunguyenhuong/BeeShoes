package com.poly.beeshoes.dto.response;

import org.springframework.beans.factory.annotation.Value;

public interface CartResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

}
