package com.cdac.MovieBooking.Service;

import com.cdac.MovieBooking.Dtos.Request.MovieDTO;
import com.cdac.MovieBooking.Dtos.Response.AdminDashboardStatsDTO;
import com.cdac.MovieBooking.Entities.Enums.MovieStatus;
import com.cdac.MovieBooking.Entities.Enums.TheatreApprovalStatus;
import com.cdac.MovieBooking.Entities.Enums.TheatreStatus;
import com.cdac.MovieBooking.Entities.Enums.UserStatus;
import com.cdac.MovieBooking.Entities.Movie;
import com.cdac.MovieBooking.Entities.Theatre;
import com.cdac.MovieBooking.Entities.User;
import com.cdac.MovieBooking.Repository.BookingRepository;
import com.cdac.MovieBooking.Repository.MovieRepository;
import com.cdac.MovieBooking.Repository.TheatreRepository;
import com.cdac.MovieBooking.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.cdac.MovieBooking.Dtos.Response.RevenueTrendDTO;
import com.cdac.MovieBooking.Dtos.Response.GenreOccupancyDTO;
import com.cdac.MovieBooking.Entities.Booking;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TheatreRepository theatreRepository;
    private final BookingRepository bookingRepository;
    private final MovieRepository movieRepository;

    @Override
    public AdminDashboardStatsDTO getDashboardStats() {
        // Calculate Revenue Trend (Last 7 days or simply existing data grouped by date)
        List<Booking> allBookings = bookingRepository.findAll();

        Map<String, BigDecimal> revenueMap = allBookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getBookingTime().format(DateTimeFormatter.ofPattern("MMM dd")),
                        Collectors.mapping(Booking::getTotalAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));

        List<RevenueTrendDTO> revenueTrend = revenueMap.entrySet().stream()
                .map(e -> new RevenueTrendDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // Calculate Genre Occupancy
        Map<String, Long> genreMap = allBookings.stream()
                .filter(b -> b.getShow() != null && b.getShow().getMovie() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getShow().getMovie().getGenre(),
                        Collectors.counting()));

        List<GenreOccupancyDTO> genreOccupancy = genreMap.entrySet().stream()
                .map(e -> new GenreOccupancyDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        return AdminDashboardStatsDTO.builder()
                .totalUsers(userRepository.count())
                .activeTheaters(theatreRepository.findAll().stream()
                        .filter(t -> t.getTheatreStatus() == TheatreStatus.ACTIVE).count())
                .totalBookings(bookingRepository.count())
                .pendingRequests(theatreRepository.findAll().stream()
                        .filter(t -> t.getTheatreApprovalStatus() == TheatreApprovalStatus.PENDING).count())
                .revenueTrend(revenueTrend)
                .genreOccupancy(genreOccupancy)
                .build();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Toggle status
        if (user.getUserStatus() == UserStatus.DELETED) {
            user.setUserStatus(UserStatus.ACTIVE);
        } else {
            user.setUserStatus(UserStatus.DELETED);
        }
        return userRepository.save(user);
    }

    @Override
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Override
    public Movie addMovie(MovieDTO movieDTO) {
        Movie movie = Movie.builder()
                .title(movieDTO.getTitle())
                .description(movieDTO.getDescription())
                .durationMinutes(movieDTO.getDurationMinutes())
                .language(movieDTO.getLanguage())
                .genre(movieDTO.getGenre())
                .releaseDate(movieDTO.getReleaseDate())
                .posterUrl(movieDTO.getPosterUrl())
                .videoUrl(movieDTO.getVideoUrl())
                .movieStatus(movieDTO.getMovieStatus() != null ? movieDTO.getMovieStatus() : MovieStatus.ACTIVE)
                .cast(movieDTO.getCast())
                .crew(movieDTO.getCrew())
                .rating(movieDTO.getRating() != null ? movieDTO.getRating() : 0.0)
                .build();
        return movieRepository.save(movie);
    }

    @Override
    public Movie updateMovie(Long id, MovieDTO movieDTO) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.setTitle(movieDTO.getTitle());
        movie.setDescription(movieDTO.getDescription());
        movie.setDurationMinutes(movieDTO.getDurationMinutes());
        movie.setLanguage(movieDTO.getLanguage());
        movie.setGenre(movieDTO.getGenre());
        movie.setReleaseDate(movieDTO.getReleaseDate());
        movie.setPosterUrl(movieDTO.getPosterUrl());
        movie.setVideoUrl(movieDTO.getVideoUrl());
        movie.setCast(movieDTO.getCast());
        movie.setCrew(movieDTO.getCrew());
        if (movieDTO.getMovieStatus() != null)
            movie.setMovieStatus(movieDTO.getMovieStatus());
        if (movieDTO.getRating() != null)
            movie.setRating(movieDTO.getRating());

        return movieRepository.save(movie);
    }

    @Override
    public Movie updateMovieStatus(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (movie.getMovieStatus() == MovieStatus.INACTIVE) {
            movie.setMovieStatus(MovieStatus.ACTIVE);
        } else {
            movie.setMovieStatus(MovieStatus.INACTIVE);
        }
        return movieRepository.save(movie);
    }

    @Override
    public List<Theatre> getPendingTheatres() {
        return theatreRepository.findAll().stream()
                .filter(t -> t.getTheatreApprovalStatus() == TheatreApprovalStatus.PENDING)
                .collect(Collectors.toList());
    }

    @Override
    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll().stream()
                .filter(t -> t.getTheatreApprovalStatus() == TheatreApprovalStatus.APPROVED)
                .collect(Collectors.toList());
    }

    @Override
    public Theatre approveTheatre(Long theatreId, boolean isApproved) {
        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() -> new RuntimeException("Theatre not found"));

        if (isApproved) {
            theatre.setTheatreApprovalStatus(TheatreApprovalStatus.APPROVED);
            theatre.setTheatreStatus(TheatreStatus.ACTIVE); // Auto activate on approval?
        } else {
            theatre.setTheatreApprovalStatus(TheatreApprovalStatus.REJECTED);
        }
        return theatreRepository.save(theatre);
    }
}
