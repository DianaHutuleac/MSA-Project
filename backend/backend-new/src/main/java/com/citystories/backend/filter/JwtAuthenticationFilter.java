package com.citystories.backend.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

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
            // Verify the token
            DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC256(SECRET_KEY))
                    .build()
                    .verify(token);

            // Extract user details
            String userId = decodedJWT.getSubject(); // Extract the "sub" claim
            String userEmail = decodedJWT.getClaim("email").asString(); // Example claim
            String userRole = decodedJWT.getClaim("role").asString();
            if (userRole == null || userRole.isEmpty()) {
                userRole = "ROLE_USER"; // Default role
            }

            // Log the token details for debugging
            System.out.println("Token verified. User ID: " + userId + ", Email: " + userEmail + ", Role: " + userRole);

            // Create a UserDetails object or use extracted details
            UserDetails userDetails = User.withUsername(userId) // Use `userId` as the username
                    .password("") // No password needed for JWT
                    .authorities(userRole != null ? userRole : "ROLE_USER") // Default role if missing
                    .build();

            // Create an Authentication object and set it in the SecurityContext
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (JWTVerificationException ex) {
            // Handle invalid or expired token
            System.out.println("Token verification failed: " + ex.getMessage());
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // Set 403 status
            return;
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
