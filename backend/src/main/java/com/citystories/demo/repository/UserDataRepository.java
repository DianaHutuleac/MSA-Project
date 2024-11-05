package com.citystories.demo.repository;

import com.citystories.demo.domain.entity.UserData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
}
