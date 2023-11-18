package com.poly.beeshoes.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;

public interface BillHistoryResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Long getId();
    String getNote();
    Integer getStatus();
    LocalDateTime getCreateAt();
    String getCreateBy();
}
