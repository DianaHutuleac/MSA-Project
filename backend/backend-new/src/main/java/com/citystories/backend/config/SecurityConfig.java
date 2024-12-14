//package com.citystories.backend.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http
//                .authorizeHttpRequests(
//                        authorizeHttp -> {
//                            authorizeHttp.anyRequest().authenticated();
//                        }
//                )
//                .formLogin(l -> l.defaultSuccessUrl("/"))
//                .logout(l -> l.logoutSuccessUrl("/"))
//                .build();
//    }
//}
