package com.poly.beeshoes.entity;

import com.poly.beeshoes.entity.base.PrimaryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "voucher")
public class Voucher extends PrimaryEntity {
    @Column(name = "code", unique = true, length = 20)
    private String code;
    @Nationalized
    @Column(name = "name", length = 50)
    private String name;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "percent_reduce")
    private Float percentReduce;
    @Column(name = "min_bill_value")
    private BigDecimal minBillValue;
    @Column(name = "start_date")
    private LocalDateTime startDate;
    @Column(name = "end_date")
    private LocalDateTime endDate;
    @Column(name = "status")
    private Integer status;
    @Column(name = "type")
    private Boolean type;
}
