package com.cdac.MovieBooking.Dtos.Request;

import com.cdac.MovieBooking.Entities.Enums.MovieStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieDTO {
    private String title;
    private String description;
    private int durationMinutes;
    private String language;
    private String genre;
    private LocalDate releaseDate;
    private String posterUrl;
    private String videoUrl;
    private MovieStatus movieStatus;
    private String cast;
    private String crew;
    private Double rating;
}
