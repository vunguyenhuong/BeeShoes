package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Address;
import com.poly.beeshoes.dto.request.AddressRequest;
import com.poly.beeshoes.dto.response.AddressResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByAccountIdAndDeleted(Long id, Boolean deleted);

    Page<Address> findByAccountIdAndDeleted(Long id, Boolean deleted, Pageable pageable);

    Address findByAccountIdAndDefaultAddress(Long id, Boolean defaultAddress);

    @Query(value = """
            SELECT
            a.id AS id,
            a.name AS name,
            a.phone_number AS phoneNumber,
            a.ward AS ward,
            a.district AS district,
            a.province AS province,
            a.specific_address AS specificAddress,
            a.default_address AS defaultAddress,
            ROW_NUMBER() OVER(ORDER BY a.create_at DESC) AS indexs,
            a.deleted AS status
            FROM address a 
            LEFT JOIN account ac on ac.id = a.account_id
            WHERE (:#{#req.account} IS NULL OR a.account_id = :#{#req.account})
            AND (:#{#req.status} IS NULL OR a.deleted = :#{#req.status})
            GROUP BY a.id
            """, nativeQuery = true)
    Page<AddressResponse> getAddress(@Param("req") AddressRequest request, Pageable pageable);
}
