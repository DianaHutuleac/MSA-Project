package com.citystories.demo.domain.entity;

import com.citystories.demo.domain.enums.VisibilityDuration;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Pin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(length = 5000)
    private String story;

    private Long numberOfLikes;

    @OneToMany(mappedBy = "pin")
    private List<Comment> comments;

    @Enumerated(EnumType.STRING)
    private VisibilityDuration visibilityDuration;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserData user;

}
