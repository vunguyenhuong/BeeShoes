package com.poly.beeshoes.entity;

import com.poly.beeshoes.entity.base.PrimaryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.util.Date;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "bill")
public class Bill extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
    @ManyToOne
    @JoinColumn(name = "customer_id")
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
