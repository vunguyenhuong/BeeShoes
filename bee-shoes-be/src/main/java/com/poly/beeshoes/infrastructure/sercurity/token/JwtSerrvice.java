package com.poly.beeshoes.infrastructure.sercurity.token;

import com.poly.beeshoes.entity.Account;
import com.poly.beeshoes.infrastructure.session.UserDetailToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtSerrvice {

    public static final String SECRET = "QHMBQfsViR66wU3Yx/MOdkKcHdmJeRy4JdbDbrjmZdfu35Q7yzH6b3vJCrQcNgoOEFfsGyhOeF5Pby7R+YzG0w==";

    public String genetateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", account.getId());
        claims.put("email", account.getEmail());
        claims.put("role", account.getAccountRoles().name());
        claims.put("fullName", account.getName());
        claims.put("avatar", account.getAvatar());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 60 * 1000))
                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String genetateRefreshToken(Map<String, Object> extractClaims, Account account) {
        extractClaims.put("id", account.getId());
        extractClaims.put("email", account.getEmail());
        extractClaims.put("role", account.getAccountRoles().name());
        extractClaims.put("fullName", account.getName());
        extractClaims.put("avatar", account.getAvatar());
        return Jwts.builder()
                .setClaims(extractClaims)
                .setSubject(account.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 30 * 24 * 60 * 60 * 60 * 1000))
                .signWith(getSiginKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // todo xác nhận quyền sở hữu
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSiginKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSiginKey() {
        byte[] key = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(key);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // todo kiểm tra hết hạn
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }


    public void decodeTheToken(String token, HttpServletRequest request) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String fullName = claims.get("fullName", String.class);
        String email = claims.get("email", String.class);
        Long id = claims.get("id", Long.class);
        String role = claims.get("role", String.class);

        HttpSession session = request.getSession();
        var user = UserDetailToken.builder().id(id).role(role).fullName(fullName).email(email).build();
        if (user.getRole().equals("ROLE_USER")) {
            session.setAttribute("customer", user);
        } else {
            session.setAttribute("employee", user);
        }
    }


}
