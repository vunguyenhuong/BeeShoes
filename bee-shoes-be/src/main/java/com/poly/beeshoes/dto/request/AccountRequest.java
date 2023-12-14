package com.poly.beeshoes.dto.request;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
public class AccountRequest extends PageableRequest {
    @NotNull(message = "Username không được để trống!")
    private String username;

    private String cccd;
    @NotNull(message = "Tên không được để trống!")
    private String name;
    @NotNull(message = "Email không được để trống!")
    private String email;
    @NotNull(message = "SDT không được để trống!")
    @Pattern(regexp = "^0[0-9]{9}$",message = "SDT không đúng định dạng!")
    private String phoneNumber;
    private MultipartFile avatar;
    @NotNull(message = "Ngày sinh không được để trống!")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
    @NotNull(message = "Giới tính không được để trống!")
    private String gender;
    private String password;

    private AddressRequest address;

    //    filter
    private Boolean deleted;
    private String roleName;
    private Boolean status;

}
