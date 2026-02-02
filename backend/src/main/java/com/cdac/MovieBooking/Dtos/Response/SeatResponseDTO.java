package com.cdac.MovieBooking.Dtos.Response;

import com.cdac.MovieBooking.Entities.Enums.SeatType;
import com.cdac.MovieBooking.Entities.Enums.ShowSeatStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponseDTO {
    private Long showSeatId; // ID of the ShowSeat entity (needed for booking)
    private Long seatId; // ID of the Seat entity
    private String seatNumber;
    private SeatType seatType;
    private BigDecimal price;
    private ShowSeatStatus status;
    private String row; // Extracted from seatNumber (e.g., "A" from "A1")
}
