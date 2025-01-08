package com.citystories.backend.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final String SECRET_KEY = "MY_SUPER_SECRET_KEY_123456";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            // No token or malformed token
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7); // Remove "Bearer " part

        try {
            DecodedJWT decoded = JWT.require(Algorithm.HMAC256(SECRET_KEY)).build().verify(token);

            String userId = decoded.getSubject();
            // e.g. get "email" claim with decoded.getClaim("email").asString()

            // Then set authentication in Spring Security context ...
            // e.g. UsernamePasswordAuthenticationToken auth = new ...
        } catch (JWTVerificationException ex) {
            // Token invalid or expired
        }

        filterChain.doFilter(request, response);
    }
}