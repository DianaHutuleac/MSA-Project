package com.citystories.backend.domain.entity;

import com.citystories.backend.domain.enums.VisibilityDuration;
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
    private Long id;

    @Column(length = 5000)
    private String story;
    private Integer numberOfLikes;

    @OneToMany(mappedBy = "pin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @Enumerated(EnumType.STRING)
    private VisibilityDuration visibilityDuration;

    private LocalDateTime expiresAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // New fields for map functionality
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.numberOfLikes = 0;
        switch (this.visibilityDuration) {
            case DAY -> this.expiresAt = createdAt.plusDays(1);
            case WEEK -> this.expiresAt = createdAt.plusWeeks(1);
            case MONTH -> this.expiresAt = createdAt.plusMonths(1);
            case PERMANENT -> this.expiresAt = null;
        }
    }

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserData user;
}
