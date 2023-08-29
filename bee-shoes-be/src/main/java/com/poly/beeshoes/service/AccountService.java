package com.poly.beeshoes.service;

import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.infrastructure.request.AccountRequest;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import org.springframework.web.multipart.MultipartFile;

public interface AccountService {
    PageableObject<Account> getAll(AccountRequest request);

    Account getOne(Long id, String roleName);

    Account create(AccountRequest request, String roleName);

    Account update(Long id, AccountRequest request);

    Account delete(Long id);
}
