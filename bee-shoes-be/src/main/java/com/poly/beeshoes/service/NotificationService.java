package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.response.NotificationResponse;
import com.poly.beeshoes.entity.Notification;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getByAccount(Long idAccount, String title);
    void delete(Long idNotification);
    void deleteAllByAccount(Long idAccount);
}
