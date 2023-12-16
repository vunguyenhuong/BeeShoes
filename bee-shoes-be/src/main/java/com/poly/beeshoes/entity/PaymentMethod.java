package com.poly.beeshoes.entity;

import com.poly.beeshoes.entity.base.PrimaryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "payment_method")
public class PaymentMethod extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;
    @Column(name = "method")
    private Integer method;
    @Column(name = "total_money")
    private BigDecimal totalMoney;
    @Nationalized
    @Column(name = "note")
    private String note;
    @Nationalized
    @Column(name = "trading_code")
    private String tradingCode;
    private Boolean type;
}
