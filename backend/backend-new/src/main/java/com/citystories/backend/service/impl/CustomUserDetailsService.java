//package com.citystories.backend.service.impl;
//
//import com.citystories.backend.domain.entity.UserData;
//import com.citystories.backend.repository.UserDataRepository;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//
//import java.util.Collections;
//import java.util.List;
//
//public class CustomUserDetailsService implements UserDetailsService {
//    private final UserDataRepository userDataRepository;
//
//    public CustomUserDetailsService(UserDataRepository userDataRepository) {
//        this.userDataRepository = userDataRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        UserData user = userDataRepository.findUserDataByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
//
//        return new User(
//                user.getEmail(),
//                user.getPassword(),
//                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
//        );
//    }
//}
