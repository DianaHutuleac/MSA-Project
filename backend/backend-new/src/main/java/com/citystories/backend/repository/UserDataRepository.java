package com.citystories.backend.repository;


import com.citystories.backend.domain.entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
}
