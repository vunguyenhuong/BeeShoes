package com.poly.beeshoes.service.impl;

import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.infrastructure.exception.RestApiException;
import com.poly.beeshoes.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.poly.beeshoes.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.poly.beeshoes.infrastructure.sercurity.auth.SignUpRequets;
import com.poly.beeshoes.infrastructure.sercurity.auth.SigninRequest;
import com.poly.beeshoes.infrastructure.sercurity.token.JwtSerrvice;
import com.poly.beeshoes.repository.IAccountRepository;
import com.poly.beeshoes.repository.IRoleRepository;
import com.poly.beeshoes.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final IAccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtSerrvice jwtSerrvice;

    @Override
    public String signUp(SignUpRequets signUpRequets) {

        Optional<Account> optional = accountRepository.findByEmail(signUpRequets.getEmail());
        if(optional.isPresent()){
            throw new RestApiException("Email không tồn tại");
        }
        Account account = new Account();
        account.setEmail(signUpRequets.getEmail());
        account.setAccountRoles(signUpRequets.getRole());
        account.setPassword(passwordEncoder.encode(signUpRequets.getPassword()));
        accountRepository.save(account);

        return "Người dùng đã được thêm vào hệ thống";
    }

    @Override
    public JwtAuhenticationResponse singIn(SigninRequest request) {

        var check = accountRepository.findByEmail(request.getEmail());
        if (check == null) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không đúng.");
        }

        if (!passwordEncoder.matches(request.getPassword(), check.get().getPassword()) && check != null) {
            throw new RestApiException("Tài khoản hoặc mật khẩu không đúng.");
        }

        var account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RestApiException("Email hoặc mật khẩu không hợp lệ."));
        var jwt = jwtSerrvice.genetateToken(account);
        var refreshToken = jwtSerrvice.genetateRefreshToken(new HashMap<>(), account);

        return JwtAuhenticationResponse.builder()
                .refreshToken(refreshToken)
                .token(jwt)
                .build();
    }


}
