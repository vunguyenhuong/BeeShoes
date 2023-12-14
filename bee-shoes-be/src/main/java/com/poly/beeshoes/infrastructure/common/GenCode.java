package com.poly.beeshoes.infrastructure.common;

import com.poly.beeshoes.repository.IBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.text.Normalizer;
import java.util.UUID;
import java.util.regex.Pattern;
@Component
public class GenCode {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 10;
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
