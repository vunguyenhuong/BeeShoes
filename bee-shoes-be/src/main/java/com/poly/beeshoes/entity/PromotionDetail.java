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

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "promotion_detail")
public class PromotionDetail extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "shoe_detail_id")
    private ShoeDetail shoeDetail;
    @ManyToOne
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;
    @Column(name = "promotion_price")
    private BigDecimal promotionPrice;
}
