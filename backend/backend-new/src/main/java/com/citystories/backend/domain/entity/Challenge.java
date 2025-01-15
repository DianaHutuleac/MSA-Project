package com.citystories.backend.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 5000)
    private String theme;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Column(nullable = false)
    private boolean processed = false;

    @OneToMany(mappedBy = "challenge")
    private List<Pin> pins = new ArrayList<>(); // Pins submitted for this challenge

    @OneToOne
    @JoinColumn(name = "winning_pin_id")
    private Pin winningPin;

    // PrePersist method to set default endDate
    @PrePersist
    private void setDefaultEndDate() {
        if (this.startDate == null) {
            this.startDate = LocalDateTime.now(); // Default start date to now if not provided
        }
        if (this.endDate == null) {
            this.endDate = this.startDate.plusWeeks(1); // Set end date to one week after start date
        }
    }
}
