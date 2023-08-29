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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString

@Entity
@Table(name = "account")
public class Account extends PrimaryEntity {
    @Column(name = "username", unique = true)
    private String username;
    @Column(name = "cccd")
    private String cccd;
    @Nationalized
    @Column(name = "name")
    private String name;
    @Column(name = "phonenumber", unique = true)
    private String phoneNumber;
    @Column(name = "email", unique = true)
    private String email;
    @Nationalized
    @Column(name = "password")
    private String password;
    @Nationalized
    @Column(name = "avatar")
    private String avatar;
    @Column(name = "birthday")
    @Temporal(TemporalType.DATE)
    private Date birthday;  
    @Nationalized
    @Column(name = "gender")
    private String gender;
    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonIgnoreProperties(value = {"createAt", "updateAt", "createBy", "updateBy", "deleted"})
    private Role role;

    @JsonIgnoreProperties(value = {"shoeDetail", "createAt", "updateAt", "createBy", "updateBy", "deleted"})
    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER)
    List<Address> addresses;
}
