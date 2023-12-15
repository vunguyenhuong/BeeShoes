package com.poly.beeshoes.dto.response;


import org.springframework.beans.factory.annotation.Value;

public interface NotificationResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getTitle();

    String getContent();

    String getAction();
    Integer getType();
    String getCreateAt();
}
