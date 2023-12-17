package com.poly.beeshoes.service.cronJob;

import com.poly.beeshoes.service.PromotionService;
import com.poly.beeshoes.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling // chạy ngầm
public class cronJob {

    @Autowired
    private VoucherService voucherService;
    @Autowired
    private PromotionService promotionService;

    @Scheduled(cron = "*/2 * * * * ?")// 2s chạy một lần
    public void autoUpdateStatusVoucher() {
        try {
            voucherService.updateStatusVoucher();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Scheduled(cron = "*/2 * * * * ?")// 2s chạy một lần
    public void autoUpdateStatusPromotion() {
        try {
            promotionService.updateStatusPromotion();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
//    @Scheduled(cron = "0 0 0 * * ?") // Chạy vào lúc 00:00:00 mỗi ngày
////    @Scheduled(cron = "*/15 * * * * ?") // Chạy vào lúc 00:00:00 mỗi ngày
//    public void createScheduledVoucher() {
//        System.out.println(".");
//        try {
//            voucherService.createScheduledVoucher();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
}