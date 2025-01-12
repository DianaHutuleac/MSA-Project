package com.citystories.backend.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String password;

    private String role;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.REMOVE}, orphanRemoval = true)
    private List<Pin> pins;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Comment> comments;

    @ManyToMany
    @JoinTable(
            name = "user_liked_pins",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "pin_id")
    )
    private List<Pin> likedPins = new ArrayList<>(); // Initialize here
}
