package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.entity.Address;
import com.poly.beeshoes.infrastructure.common.GenCode;
import com.poly.beeshoes.infrastructure.common.PageableObject;
import com.poly.beeshoes.infrastructure.constant.AccountRoles;
import com.poly.beeshoes.infrastructure.converter.AccountConvert;
import com.poly.beeshoes.infrastructure.converter.AddressConvert;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.dto.request.AccountRequest;
import com.poly.beeshoes.dto.response.AccountResponse;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.IAddressRepository;
import com.poly.beeshoes.repository.IRoleRepository;
import com.poly.beeshoes.service.AccountService;
import com.poly.beeshoes.util.CloudinaryUtils;
import com.poly.beeshoes.util.MailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private IAccountRepository accountRepository;
    @Autowired
    private IRoleRepository roleRepository;
    @Autowired
    private IAddressRepository addressRepository;
    @Autowired
    private AccountConvert accountConvert;
    @Autowired
    private AddressConvert addressConvert;
    @Autowired
    private MailUtils mailUtils;
    @Autowired
    private CloudinaryUtils cloudinaryUtils;

    @Override
    public PageableObject<AccountResponse> getAll(AccountRequest request) {
        Pageable pageable = PageRequest.of(request.getPage()-1, request.getSizePage());
        return new PageableObject<>(accountRepository.getAll(request, pageable));
    }

    @Override
    public Account getOne(Long id, String roleName) {
        return accountRepository.getOne(id, roleName);
    }

    @Override
    @Transactional
    public Account create(AccountRequest request, String roleName) {
        if (accountRepository.existsByUsernameAndUsernameNot(request.getUsername(), ""))
            throw new RestApiException("Username đã tồn tại!");
        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), ""))
            throw new RestApiException("Email đã tồn tại!");
        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(request.getPhoneNumber(), ""))
            throw new RestApiException("SDT đã tồn tại!");
        if (accountRepository.existsByCccdAndCccdNot(request.getCccd(), ""))
            throw new RestApiException("Mã định danh đã tồn tại!");

        String randomPassword = GenCode.randomPassword();
        Account account = accountConvert.convertRequestToEntity(request);
        account.setRole(roleRepository.findByName(roleName));
        account.setAccountRoles(roleName.equals("Khách hàng") ? AccountRoles.ROLE_USER : AccountRoles.ROLE_EMLOYEE);
        account.setPassword(randomPassword);
        account.setAvatar("defaultAvatar.jpg");
        Account accountSave = accountRepository.save(account);
        if (accountSave != null) {
            Address address = addressConvert.convertRequestToEntity(request.getAddress());
            address.setAccount(accountSave);
            addressRepository.save(address);
//            Upload Images
            if (request.getAvatar() != null)
                accountSave.setAvatar(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAvatar(), "account")));
//            Send Mail
            String emailContent = "Chào " + accountSave.getEmail() + "\n" + "Bạn vừa dùng email này để đăng ký tài khoản cho hệ thống Bee Shoes Store\n" + "Tài khoản của bạn là: " + accountSave.getUsername() + "\n" + "Mật khẩu đăng nhập là: " + accountSave.getPassword() + "\n\n" + "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n" + "Trang chủ BeeShoes: https://beeshoes.vunguyenhuong.id.vn\n" + "Liên hệ: https://facebook.com/VuNguyenHuong.Official";
            mailUtils.sendEmail(accountSave.getEmail(), "Thư xác thực tài khoản", emailContent);
        }
        return accountSave;
    }

    @Override
    public Account update(Long id, AccountRequest request) {
        Account old = accountRepository.findById(id).get();
        if (accountRepository.existsByUsernameAndUsernameNot(request.getUsername(), old.getUsername()))
            throw new RestApiException("Username đã tồn tại!");
        if (accountRepository.existsByEmailAndEmailNot(request.getEmail(), old.getEmail()))
            throw new RestApiException("Email đã tồn tại!");
        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(request.getPhoneNumber(), old.getPhoneNumber()))
            throw new RestApiException("SDT đã tồn tại!");
        if (accountRepository.existsByCccdAndCccdNot(request.getCccd(), old.getCccd()))
            throw new RestApiException("Mã định danh đã tồn tại!");
        Account accountSave = accountRepository.save(accountConvert.convertRequestToEntity(id, request));
        if (accountSave != null) {
            if (request.getAvatar() != null) {
                accountSave.setAvatar(String.valueOf(cloudinaryUtils.uploadSingleImage(request.getAvatar(), "account")));
                accountRepository.save(accountSave);
            }
        }
        return accountSave;
    }

    @Override
    public Account delete(Long id) {
        return null;
    }
}
