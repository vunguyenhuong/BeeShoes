package com.poly.beeshoes.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.poly.beeshoes.entity.base.PrimaryEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.util.Date;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString

@Entity
@Table(name = "bill")
public class Bill extends PrimaryEntity {
    @ManyToOne
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;
    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Account account;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Account customer;
    @Column(name = "code")
    private String code;
    @Column(name = "type")
    private Integer type;
    @Nationalized
    @Column(name = "customer_name")
    private String customerName;
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    @Nationalized
    @Column(name = "address")
    private String address;
    @Column(name = "money_ship")
    private BigDecimal moneyShip;
    @Column(name = "money_reduce")
    private BigDecimal moneyReduce;
    @Column(name = "total_money")
    private BigDecimal totalMoney;
    @Column(name = "pay_date")
    private Date payDate;
    @Column(name = "ship_date")
    private Date shipDate;
    @Column(name = "desired_date")
    private Date desiredDate;
    @Column(name = "receive_date")
    private Date receiveDate;
    @Column(name = "status")
    private Integer status;
}
