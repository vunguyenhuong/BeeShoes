package com.poly.beeshoes.infrastructure.request.bill;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class BillRequest extends PageableRequest {
    private Long id;
    private String code;
    @NotNull(message = "Chưa có tài khoản")
    private Long account;
    private Long voucher;
    private Long customer;
//    @NotNull(message = "Vui lòng chọn kiểu hóa đơn")
    private Integer type;
//    @NotNull(message = "Vui lòng chọn khách hàng")
    private String customerName;
//    @NotNull(message = "Vui lòng nhập số điện thoại")
    private String phoneNumber;
//    @NotNull(message = "Vui lòng chọn địa chỉ")
    private String address;
//    @NotNull(message = "Chưa có thông tin phí ship")
    private BigDecimal moneyShip;
//    @NotNull(message = "Vui lòng nhập số tiền giảm")
    private BigDecimal moneyReduce;
//    @NotNull(message = "Vui lòng nhập tổng tiền")
    private BigDecimal totalMoney;
//    @NotNull(message = "Vui lòng chọn ngày thanh toán")
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date payDate;
//    @NotNull(message = "Vui lòng chọn ngày ship")
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date shipDate;
//    @NotNull(message = "Vui lòng chọn ngày mong muốn nhận hàng")
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date desiredDate;
//    @NotNull(message = "Vui lòng nhập ngày nhận hàng")
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date receiveDate;
//    @NotNull(message = "Vui lòng chọn trạng thái hóa đơn")
    private Integer status;

}
