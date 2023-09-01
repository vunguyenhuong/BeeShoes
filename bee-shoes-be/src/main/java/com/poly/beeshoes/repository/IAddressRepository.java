package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IAddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByAccountIdAndDeleted(Long id, Boolean deleted);
    Page<Address> findByAccountIdAndDeleted(Long id, Boolean deleted, Pageable pageable);

    Address findByAccountIdAndDefaultAddress(Long id, Boolean defaultAddress);
}
