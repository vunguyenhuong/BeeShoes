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
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString

@Entity
@Table(name = "address")
public class Address extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnore
    private Account account;
    @Nationalized
    @Column(name = "name")
    private String name;
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    @Nationalized
    @Column(name = "specific_address")
    private String specificAddress;
    @Nationalized
    @Column(name = "ward")
    private String ward;
    @Nationalized
    @Column(name = "district")
    private String district;
    @Nationalized
    @Column(name = "province")
    private String province;
    @Column(name = "default_address")
    private Boolean defaultAddress;
}
