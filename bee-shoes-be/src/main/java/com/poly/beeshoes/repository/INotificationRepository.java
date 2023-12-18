package com.poly.beeshoes.repository;

import com.poly.beeshoes.dto.response.NotificationResponse;
import com.poly.beeshoes.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INotificationRepository extends JpaRepository<Notification, Long> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY n.create_at DESC) AS indexs,
            n.id AS id,
            n.title AS title,
            n.content AS content,
            n.action AS action,
            n.create_at AS createAt,
            n.type AS type
            FROM notification n
            WHERE n.account_id = :idAccount
            """, nativeQuery = true)
    List<NotificationResponse> getByAccount(@Param("idAccount") Long id);

    List<Notification> findByAccountId(Long id);
}
