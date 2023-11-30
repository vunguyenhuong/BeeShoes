package com.poly.beeshoes.repository;

import com.poly.beeshoes.dto.response.CartResponse;
import com.poly.beeshoes.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICartRepository extends JpaRepository<Cart, Long> {
    @Query(value = """
            SELECT
                cd.id AS id,
                ROW_NUMBER() OVER(ORDER BY cd.update_at DESC) AS indexs,
                CONCAT(s.name, ' [', c.name, ' - ', sz.name, ']') AS name,
                sd.id AS idProductDetail,
                cd.quantity AS quantity,
                sd.price AS price,
                sl.name AS sole,
                SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.name ORDER BY img.name), ',', 1) AS image,
                MIN(pmd.promotion_price) AS discountValue,
                MAX(pm.value) AS discountPercent
            FROM cart_detail cd LEFT JOIN cart ct ON cd.cart_id = ct.id
            LEFT JOIN shoe_detail sd ON sd.id = cd.shoe_detail_id
            LEFT JOIN color c ON c.id = sd.color_id
            LEFT JOIN size sz ON sz.id = sd.size_id
            LEFT JOIN shoe s ON sd.shoe_id = s.id
            LEFT JOIN sole sl ON sd.sole_id = sl.id
            LEFT JOIN (SELECT shoe_detail_id, 
            GROUP_CONCAT(DISTINCT name) AS name FROM images GROUP BY shoe_detail_id
            ) img ON sd.id = img.shoe_detail_id
            LEFT JOIN promotion_detail pmd ON pmd.shoe_detail_id = sd.id
            LEFT JOIN promotion pm ON pm.id = pmd.promotion_id
            WHERE ct.account_id = :idAccount
            GROUP BY s.id,cd.id
        """, nativeQuery = true)
    List<CartResponse> getListCart(@Param("idAccount") Long idAccount);

    Cart findByAccountId(Long idAccount);
}
