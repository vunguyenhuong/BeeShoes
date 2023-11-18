package com.poly.beeshoes.dto.response;

import com.poly.beeshoes.entity.Color;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {Color.class})
public interface ColorResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();

    String getName();

    Boolean getStatus();
    LocalDateTime getCreateAt();
}
