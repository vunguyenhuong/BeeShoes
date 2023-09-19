package com.poly.beeshoes.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

@Entity
@Table(name = "images")
public class Images extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "shoe_detail_id")
    @JsonIgnore
    private ShoeDetail shoeDetail;
    @Nationalized
    @Column(name = "name")
    private String name;
}
