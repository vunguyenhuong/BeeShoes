package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Category;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDateTime;

@Projection(types = {Category.class})
public interface CategoryResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getName();

    Boolean getStatus();

    LocalDateTime getCreateAt();
}
