package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.infrastructure.request.AccountRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IAccountRepository extends JpaRepository<Account, Long> {
    @Query("""
            SELECT a FROM Account a LEFT JOIN FETCH a.addresses
            WHERE a.role.name = :role AND a.id = :id
            """)
    Account getOne(@Param("id") Long id, @Param("role") String roleName);

    @Query("""
            SELECT a FROM Account a LEFT JOIN a.addresses
            WHERE (:#{#req.name} IS NULL 
            OR a.name LIKE %:#{#req.name}% OR a.email LIKE %:#{#req.name}%
            OR a.username LIKE %:#{#req.name}% OR a.phoneNumber LIKE %:#{#req.name}%)
            AND (:#{#req.deleted} IS NULL OR a.deleted = :#{#req.deleted})
            AND a.role.name = :#{#req.roleName}
            ORDER BY a.createAt DESC 
            """)
    Page<Account> getAll(@Param("req") AccountRequest request, Pageable pageable);

    Boolean existsByUsernameAndUsernameNot(String username, String exceptUsername);

    Boolean existsByEmailAndEmailNot(String email, String exceptEmail);

    Boolean existsByPhoneNumberAndPhoneNumberNot(String phoneNumber, String exceptPhoneNumber);

    Boolean existsByCccdAndCccdNot(String cccd, String exceptCccd);
}
