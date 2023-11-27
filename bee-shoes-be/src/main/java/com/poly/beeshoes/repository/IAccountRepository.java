package com.poly.beeshoes.repository;

import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.dto.request.AccountRequest;
import com.poly.beeshoes.dto.response.AccountResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAccountRepository extends JpaRepository<Account, Long> {
    @Query("""
            SELECT a FROM Account a
            WHERE a.role.name = :role AND a.id = :id
            """)
    Account getOne(@Param("id") Long id, @Param("role") String roleName);

    @Query(value = """
            select 
            a.id as id,
            a.name as name,
            a.email as email,a.avatar as avatar,a.gender as gender,a.birthday as birthday,
            a.phonenumber as phoneNumber,
            a.create_at as createAt,
            a.deleted as status,
            ROW_NUMBER() OVER(ORDER BY a.create_at DESC) AS indexs
            from Account a
            left join role r on r.id = a.role_id
            where (:#{#req.name} is null
            or a.name like %:#{#req.name}% 
            or a.email like %:#{#req.name}%
            or a.username like %:#{#req.name}% 
            or a.phoneNumber like %:#{#req.name}%)
            and (:#{#req.roleName} is null or r.name = :#{#req.roleName})
            and (:#{#req.status} is null or a.deleted = :#{#req.status})
            group by a.id
            """, nativeQuery = true)
    Page<AccountResponse> getAll(@Param("req") AccountRequest request, Pageable pageable);

    Boolean existsByUsernameAndUsernameNot(String username, String exceptUsername);

    Boolean existsByEmailAndEmailNot(String email, String exceptEmail);

    Boolean existsByPhoneNumberAndPhoneNumberNot(String phoneNumber, String exceptPhoneNumber);

    Boolean existsByCccdAndCccdNot(String cccd, String exceptCccd);

    @Query("SELECT ac FROM Account ac WHERE ac.email =:email")
    Optional<Account> findByEmail(String email);

}
