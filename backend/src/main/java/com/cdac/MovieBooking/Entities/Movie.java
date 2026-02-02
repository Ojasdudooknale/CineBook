package com.cdac.MovieBooking.Entities;

import com.cdac.MovieBooking.Entities.Enums.MovieStatus;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "movies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movieId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int durationMinutes;
    private String language;
    private String genre;
    private LocalDate releaseDate;

    @Column(length = 2048)
    private String posterUrl;

    @Column(length = 2048)
    private String videoUrl;

    @Enumerated(EnumType.STRING)
    private MovieStatus movieStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private String cast;
    private String crew;

    private Double rating;
}