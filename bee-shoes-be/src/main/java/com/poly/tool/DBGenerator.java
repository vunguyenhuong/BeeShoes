package com.poly.tool;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.poly.beeshoes.repository")
public class DBGenerator implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {

    }
}
