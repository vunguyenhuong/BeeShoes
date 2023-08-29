package com.poly.beeshoes.infrastructure.common;

import com.poly.beeshoes.repository.IBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.UUID;
import java.util.regex.Pattern;
@Component
public class GenCode {
    @Autowired
    private static IBillRepository billRepository;
    public static String genCodeByName(String name){
        /*
        * input: Vũ Nguyên Hướng
        * output: VUNGUYENHUONG
        * */
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(Normalizer.normalize(name, Normalizer.Form.NFD))
                .replaceAll("")
                .replaceAll("\\s","").toUpperCase();
    }

    public static String randomPassword(){
        return UUID.randomUUID().toString().substring(0, 8);
    }
    public static String genBillCode(){
        String prefix = "HD100";
        int x = 1;
        String code = prefix + x;
        while (billRepository.existsByCode(code)) {
            x++;
            code = prefix + x;
        }
        return code;
    }
}
