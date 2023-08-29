package com.poly.beeshoes.infrastructure.response;

import com.poly.beeshoes.entity.Shoe;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.rest.core.config.Projection;

import java.util.List;

@Projection(types = {Shoe.class})
public interface ShoeResponse {
    Long getId();

    String getName();

    BrandResponse getBrand();

    CategoryResponse getCategory();
    Integer getQuantity();
}
