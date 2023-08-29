package com.poly.beeshoes.entity;

import com.poly.beeshoes.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "cart_detail")
public class CartDetail extends BaseEntity {
    @EmbeddedId
    private CartDetailId cartDetailId;
    @Column(name = "quantity")
    private Integer quantity;
}
