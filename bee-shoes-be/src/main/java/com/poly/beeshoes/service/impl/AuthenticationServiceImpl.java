package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.dto.request.logindto.ChangePassword;
import com.poly.beeshoes.dto.request.logindto.ResetPassword;
import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.infrastructure.common.GenCode;
import com.poly.beeshoes.infrastructure.constant.AccountRoles;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.poly.beeshoes.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.poly.beeshoes.infrastructure.sercurity.auth.SignUpRequets;
import com.poly.beeshoes.infrastructure.sercurity.auth.SigninRequest;
import com.poly.beeshoes.infrastructure.sercurity.token.JwtSerrvice;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.IRoleRepository;
import com.poly.beeshoes.service.AuthenticationService;
import com.poly.beeshoes.util.MailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final IAccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtSerrvice jwtSerrvice;

    private final IRoleRepository roleRepository;
    @Autowired
    private MailUtils mailUtils;

    @Override
    public String signUp(SignUpRequets signUpRequets) {
        Account account = new Account();
        account.setEmail(signUpRequets.getEmail());
        account.setAccountRoles(signUpRequets.getRole());
        account.setPhoneNumber(signUpRequets.getPhoneNumber());
        account.setPassword(passwordEncoder.encode(signUpRequets.getPassword()));
        if(signUpRequets.getRole().equals(AccountRoles.ROLE_USER)){
            account.setRole(roleRepository.findByName("Khách hàng"));
        }
        if (accountRepository.existsByEmailAndEmailNot(signUpRequets.getEmail(), ""))
            throw new RestApiException("Email đã tồn tại!");
        if (accountRepository.existsByPhoneNumberAndPhoneNumberNot(signUpRequets.getPhoneNumber(), ""))
            throw new RestApiException("SDT đã tồn tại!");
        accountRepository.save(account);
        String emailContent = "Chào " + signUpRequets.getEmail() + "\n" + "Bạn vừa dùng email này để đăng ký tài khoản cho hệ thống Bee Shoes Store\n" + "Tài khoản của bạn là: " + signUpRequets.getEmail() + "\n" + "Mật khẩu đăng nhập là: " + signUpRequets.getPassword() + "\n\n" + "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n" + "Trang chủ BeeShoes: https://beeshoes.vunguyenhuong.id.vn\n" + "Liên hệ: https://facebook.com/VuNguyenHuong.Official";
        mailUtils.sendEmail(signUpRequets.getEmail(), "Thư xác thực tài khoản", emailContent);
        return "Người dùng đã được thêm vào hệ thống";
    }

    @Override
    public JwtAuhenticationResponse singIn(SigninRequest request) {
        Account check = accountRepository.findByEmail(request.getEmail()).orElse(null);
        if (check == null) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không chính xác!");
        }

        if (!passwordEncoder.matches(request.getPassword(), check.getPassword()) && check != null) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không chính xác!");
        }
        var jwt = jwtSerrvice.genetateToken(check);
        var refreshToken = jwtSerrvice.genetateRefreshToken(new HashMap<>(), check);
        return JwtAuhenticationResponse.builder()
                .refreshToken(refreshToken)
                .token(jwt)
                .build();
    }

    @Override
    public String resetPassword(ResetPassword resetPassword) {
        Optional<Account> optional = accountRepository.findByEmail(resetPassword.getEmailForgot());
        if (!optional.isPresent()) {
            throw new RestApiException("Không tìm thấy tài khoản.");
        }

        String password = GenCode.randomPassword();
        optional.get().setPassword(passwordEncoder.encode(password));
        accountRepository.save(optional.get());
        String emailContent = "Chào " + optional.get().getEmail() + "\n" + "Mật khẩu mới cho hệ thống Bee Shoes Store\n" + "Tài khoản của bạn là: " + optional.get().getEmail() + "\n" + "Mật khẩu đăng nhập là: " + password + "\n\n" + "Đây là email tự động, vui lòng không reply email này.\nCảm ơn.\n\n" + "Trang chủ BeeShoes: https://beeshoes.vunguyenhuong.id.vn\n" + "Liên hệ: https://facebook.com/VuNguyenHuong.Official";
        mailUtils.sendEmail(optional.get().getEmail(), "Thư xác thực tài khoản", emailContent);
        return "Thành công.";
    }

    @Override
    public String changePassword(ChangePassword changePassword) {
        var optional = accountRepository.findByEmail(changePassword.getEmail());
        if (!optional.isPresent()) {
            throw new RestApiException("Không tìm thấy tài khoản.");
        }
        if (passwordEncoder.matches(changePassword.getPassword(), optional.get().getPassword())) {
            String newPasswordEncoded = passwordEncoder.encode(changePassword.getNewPassword());
            optional.get().setPassword(newPasswordEncoded);
            accountRepository.save(optional.get());
        } else {
            throw new RestApiException("Mật khẩu hiện tại không đúng");
        }
        return "Đổi mật khẩu thành công";
    }


}
