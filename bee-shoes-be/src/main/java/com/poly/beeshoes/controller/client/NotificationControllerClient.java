package com.poly.beeshoes.controller.client;

import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client/api/notification")
public class NotificationControllerClient {
    @Autowired
    private NotificationService notificationService;
    @GetMapping("/{id}")
    public ResponseObject getByAccount(@PathVariable(name = "id") Long id){
        return new ResponseObject(notificationService.getByAccount(id));
    }

    @PutMapping("/{id}")
    public ResponseObject updateType(@PathVariable Long id){
        return notificationService.updateType(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        notificationService.delete(id);
    }

    @DeleteMapping("/delete-all/{id}")
    public void deleteAll(@PathVariable Long id){
        notificationService.deleteAllByAccount(id);
    }
}
