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

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "bill_detail")
public class BillDetail extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "shoe_detail_id")
    private ShoeDetail shoeDetail;
    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;
    @Column(name = "price")
    private BigDecimal price;
    @Column(name = "quantity")
    private Integer quantity;

}
