package com.cdac.MovieBooking.Service;

import com.cdac.MovieBooking.Dtos.Response.SeatLayoutResponseDTO;
import com.cdac.MovieBooking.Dtos.Response.SeatResponseDTO;
import com.cdac.MovieBooking.Dtos.Response.ShowResponseDTO;
import com.cdac.MovieBooking.Dtos.Response.TheatreResponseDTO;
import com.cdac.MovieBooking.Entities.Movie;
import com.cdac.MovieBooking.Entities.Screen;
import com.cdac.MovieBooking.Entities.Show;
import com.cdac.MovieBooking.Entities.ShowSeat;
import com.cdac.MovieBooking.Entities.Enums.SeatType;
import com.cdac.MovieBooking.Entities.Enums.ShowSeatStatus;
import com.cdac.MovieBooking.Exception.MovieNotFoundException;
import com.cdac.MovieBooking.Repository.MovieRepository;
import com.cdac.MovieBooking.Repository.ShowRepository;
import com.cdac.MovieBooking.Repository.ShowSeatRepository;
import com.cdac.MovieBooking.Repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PublicServiceImpl implements PublicService {

        private final MovieRepository movieRepository;
        private final TheatreRepository theatreRepository;
        private final ShowRepository showRepository;
        private final ShowSeatRepository showSeatRepository;

        public List<Movie> getAllMovies() {
                return movieRepository.findAll()
                                .stream()
                                .filter(movie -> movie
                                                .getMovieStatus() == com.cdac.MovieBooking.Entities.Enums.MovieStatus.ACTIVE)
                                .collect(Collectors.toList());
        }

        public Movie getMovieById(Long id) {
                return movieRepository.findById(id)
                                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id " + id));

        }

        public String getMovieCast(Long movieId) {
                Movie movie = movieRepository.findById(movieId)
                                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id " + movieId));

                return movie.getCast();
        }

        public List<TheatreResponseDTO> getAllTheatres() {
                return theatreRepository.findAll()
                                .stream()
                                .map(theatre -> TheatreResponseDTO.builder()
                                                .theatreId(theatre.getTheatreId())
                                                .theatreName(theatre.getTheatreName())
                                                .location(theatre.getLocation())
                                                .theatreStatus(theatre.getTheatreStatus())
                                                .theatreApprovalStatus(theatre.getTheatreApprovalStatus())
                                                .build())
                                .toList();
        }

        public List<ShowResponseDTO> getShowsByMovie(Long movieId) {
                return showRepository.findByMovie_MovieId(movieId)
                                .stream()
                                .map(show -> {
                                        Screen screen = show.getScreen();
                                        Movie movie = show.getMovie();

                                        // Count available seats
                                        long availableSeats = showSeatRepository.findByShow_ShowId(show.getShowId())
                                                        .stream()
                                                        .filter(seat -> seat
                                                                        .getShowSeatStatus() == ShowSeatStatus.AVAILABLE)
                                                        .count();

                                        return ShowResponseDTO.builder()
                                                        .showId(show.getShowId())
                                                        .showTime(show.getShowTime())
                                                        .price(show.getPrice())
                                                        .screenId(screen.getScreenId())
                                                        .screenNumber(screen.getScreenNumber())
                                                        .theatreName(screen.getTheatre().getTheatreName())
                                                        .location(screen.getTheatre().getLocation())
                                                        .layoutType(screen.getLayoutType().toString())
                                                        .availableSeats((int) availableSeats)
                                                        .movieId(movie.getMovieId())
                                                        .movieTitle(movie.getTitle())
                                                        .posterUrl(movie.getPosterUrl())
                                                        .durationMinutes(movie.getDurationMinutes())
                                                        .language(movie.getLanguage())
                                                        .genre(movie.getGenre())
                                                        .build();
                                })
                                .toList();
        }

        @Override
        public SeatLayoutResponseDTO getSeatsForShow(Long showId) {
                // Fetch all show seats for this show
                List<ShowSeat> showSeats = showSeatRepository.findByShow_ShowId(showId);

                if (showSeats.isEmpty()) {
                        throw new RuntimeException("No seats found for show ID: " + showId);
                }

                // Get show details for layout type
                Show show = showSeats.get(0).getShow();
                Screen screen = show.getScreen();

                // Convert to SeatResponseDTO and extract rows
                Set<String> uniqueRows = new TreeSet<>();
                Map<SeatType, BigDecimal> priceMap = new HashMap<>();

                List<SeatResponseDTO> seatDTOs = showSeats.stream()
                                .map(showSeat -> {
                                        String seatNumber = showSeat.getSeat().getSeatNumber();
                                        String row = seatNumber.replaceAll("[^A-Z]", ""); // Extract letters (row)
                                        uniqueRows.add(row);

                                        SeatType seatType = showSeat.getSeat().getSeatType();
                                        priceMap.putIfAbsent(seatType, showSeat.getPrice());

                                        return SeatResponseDTO.builder()
                                                        .showSeatId(showSeat.getShowSeatId())
                                                        .seatId(showSeat.getSeat().getSeatId())
                                                        .seatNumber(seatNumber)
                                                        .seatType(seatType)
                                                        .price(showSeat.getPrice())
                                                        .status(showSeat.getShowSeatStatus())
                                                        .row(row)
                                                        .build();
                                })
                                .collect(Collectors.toList());

                // Group seats by row
                Map<String, List<SeatResponseDTO>> seatsByRow = seatDTOs.stream()
                                .collect(Collectors.groupingBy(SeatResponseDTO::getRow));

                // Count available seats
                long availableSeats = seatDTOs.stream()
                                .filter(seat -> seat.getStatus() == ShowSeatStatus.AVAILABLE)
                                .count();

                return SeatLayoutResponseDTO.builder()
                                .rows(new ArrayList<>(uniqueRows))
                                .seatsByRow(seatsByRow)
                                .layoutType(screen.getLayoutType())
                                .priceMap(priceMap)
                                .totalSeats(seatDTOs.size())
                                .availableSeats((int) availableSeats)
                                .build();
        }

}
