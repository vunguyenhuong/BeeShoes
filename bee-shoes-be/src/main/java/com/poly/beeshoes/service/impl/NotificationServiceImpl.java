package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.response.NotificationResponse;
import com.poly.beeshoes.entity.Notification;
import com.poly.beeshoes.repository.INotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService{
    @Autowired
    private INotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getByAccount(Long idAccount, String title) {
        return notificationRepository.getByAccount(idAccount, title);
    }

    @Override
    public void delete(Long idNotification) {
        notificationRepository.deleteById(idNotification);
    }

    @Override
    public void deleteAllByAccount(Long idAccount) {
        notificationRepository.deleteAll(notificationRepository.findByAccountId(idAccount));
    }
}
