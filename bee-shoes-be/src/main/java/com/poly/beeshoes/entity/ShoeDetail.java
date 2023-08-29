package com.poly.beeshoes.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.poly.beeshoes.entity.base.PrimaryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder

@Entity
@Table(name = "shoe_detail")

public class ShoeDetail extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "shoe_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Shoe shoe;
    @ManyToOne
    @JoinColumn(name = "size_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Size size;
    @ManyToOne
    @JoinColumn(name = "sole_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Sole sole;
    @ManyToOne
    @JoinColumn(name = "color_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Color color;
    @Column(name = "code", length = 50)
    private String code;
    @Column(name = "price")
    private BigDecimal price;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "weight")
    private Double weight;
    @JsonIgnoreProperties(value = {"shoeDetail", "createAt", "updateAt", "createBy", "updateBy", "deleted"})
    @OneToMany(mappedBy = "shoeDetail", fetch = FetchType.LAZY)
    private List<Images> images;
}
