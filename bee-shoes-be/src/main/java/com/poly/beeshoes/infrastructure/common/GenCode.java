package com.poly.beeshoes.infrastructure.common;

import com.poly.beeshoes.repository.IBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.UUID;
import java.util.regex.Pattern;
@Component
public class GenCode {
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

}
