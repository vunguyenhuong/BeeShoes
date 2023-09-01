package com.poly.beeshoes.infrastructure.request;

import com.poly.beeshoes.infrastructure.common.PageableRequest;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ShoeDetailRequest extends PageableRequest {
    private Long id;
    private String code;
    @NotNull(message = "Vui lòng chọn giày!")
    private Long shoe;
    @NotNull(message = "Vui lòng chọn màu sắc!")
    private Long color;
    @NotNull(message = "Vui lòng chọn kích cỡ!")
    private Long size;
    @NotNull(message = "Vui lòng chọn loại đế!")
    private Long sole;
    @NotNull(message = "Số lượng không được để trống!")
    private Integer quantity;
    @NotNull(message = "Đơn giá không được để trống!")
    private BigDecimal price;
    @NotNull(message = "Cân nặng không được để trống!")
    private Double weight;
    @NotEmpty(message = "Hình ảnh không được để trống!")
    @Size(max = 6, message = "Chỉ được thêm tối đa 6 hình ảnh!")
    private List<String> listImages;

    //    filter
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean deleted;
    private String name;
}
