package com.poly.beeshoes.service;

import com.poly.beeshoes.dto.request.logindto.ChangePassword;
import com.poly.beeshoes.dto.request.logindto.ResetPassword;
import com.poly.beeshoes.infrastructure.sercurity.auth.JwtAuhenticationResponse;
import com.poly.beeshoes.infrastructure.sercurity.auth.RefreshTokenRequets;
import com.poly.beeshoes.infrastructure.sercurity.auth.SignUpRequets;
import com.poly.beeshoes.infrastructure.sercurity.auth.SigninRequest;

public interface AuthenticationService {

    String signUp(SignUpRequets signUpRequets);

    JwtAuhenticationResponse singIn(SigninRequest request);

    String resetPassword(ResetPassword resetPassword);

    String changePassword (ChangePassword changePassword);


}
