package com.poly.beeshoes.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.poly.beeshoes.entity.base.PrimaryEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "notification")
public class Notification extends PrimaryEntity {
    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnore
    private Account account;
    @Column(name = "type")
    private Integer type;
    @Nationalized
    @Column(name = "title")
    private String title;
    @Nationalized
    @Column(name = "content")
    private String content;
    @Nationalized
    @Column(name = "action")
    private String action;

}
