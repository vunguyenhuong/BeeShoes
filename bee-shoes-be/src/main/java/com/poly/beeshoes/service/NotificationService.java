package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.response.NotificationResponse;
import com.poly.beeshoes.entity.Notification;
import com.poly.beeshoes.infrastructure.common.ResponseObject;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getByAccount(Long idAccount);
    ResponseObject updateType(Long id);
    void delete(Long idNotification);
    void deleteAllByAccount(Long idAccount);
}
