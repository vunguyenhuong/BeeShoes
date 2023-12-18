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
    public static String genCodeByName(String name) {
        /*
         * input: Vũ Nguyên Hướng
         * output: VUNGUYENHUONG
         * */

        // Remove diacritical marks and spaces, convert to uppercase
        String normalizedCode = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("\\s", "")
                .replace("đ", "d")  // Thay thế ký tự "đ" thành "d"
                .replace("Đ", "D")  // Thay thế ký tự "Đ" thành "D"
                .toUpperCase();

        // Get the last 15 characters
        int length = normalizedCode.length();
        int startIndex = Math.max(0, length - 15);
        return normalizedCode.substring(startIndex);
    }

    public static String randomPassword(){
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
