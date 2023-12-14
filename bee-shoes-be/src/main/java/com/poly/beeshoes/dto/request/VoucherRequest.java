package com.poly.beeshoes.dto.request;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class VoucherRequest extends PageableRequest {
    private String code;
    @NotNull(message = "Tên Voucher không được để trống!")
    private String name;
    @NotNull(message = "Số lượng không được để trống!")
    private Integer quantity;
    @NotNull(message = "Phần trăm giảm không được để trống!")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]+)?$", message = "Phần trăm giảm phải là số")
    private String percentReduce;
    @NotNull(message = "Giá trị hóa đơn tối thiểu không được để trống!")
    private BigDecimal minBillValue;
    @NotNull(message = "Ngày bắt đầu không được để trống!")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime startDate;
    @NotNull(message = "Ngày kết thúc không được để trống!")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;
    private Boolean type;
    private List<Long> customers;

    //    filter
    private Boolean deleted;
    private Integer status;

}
