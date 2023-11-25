package com.poly.beeshoes.controller.client;

import com.poly.beeshoes.dto.request.AccountRequest;
import com.poly.beeshoes.dto.response.AccountResponse;
import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.common.ResponseObject;
import com.poly.beeshoes.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client/api/customer")
public class CustomerControllerClient {
    private static String ROLE = "Khách hàng";
    @Autowired
    private AccountService accountService;

    @GetMapping
    public PageableObject<AccountResponse> getAll(AccountRequest request) {
        request.setRoleName(ROLE);
        return accountService.getAll(request);
    }

    @GetMapping("/{id}")
    public Account getOne(@PathVariable Long id) {
        return accountService.getOne(id, ROLE);
    }

    @PostMapping
    public ResponseObject create(@ModelAttribute @Valid AccountRequest request) {
        return new ResponseObject(accountService.create(request, ROLE));
    }

    @PutMapping("/{id}")
    public ResponseObject update(@PathVariable Long id,
                                 @ModelAttribute @Valid AccountRequest request) {
        return new ResponseObject(accountService.update(id, request));
    }
}
