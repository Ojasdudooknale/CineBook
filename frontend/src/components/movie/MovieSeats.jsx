import React from 'react';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CreditCard } from 'lucide-react';
import Footer from '../Footer';

const BookingView = ({
  seatLayout,
  theater,
  date,
  time,
  selectedSeats,   // seatIds[]
  onSeatClick,
  onBack,
  onPayment
}) => {
  if (!seatLayout) return <div className="text-white">Loading...</div>;

  const { rows, seatsByRow, priceMap, layoutType, availableSeats, totalSeats } = seatLayout;

  /* ---------------- TOTAL ---------------- */
  const calculateTotal = () => {
    let total = 0;
    rows.forEach(row => {
      seatsByRow[row]?.forEach(seat => {
        if (selectedSeats.includes(seat.showSeatId)) {
          total += Number(seat.price);
        }
      });
    });
    return total;
  };

  const total = calculateTotal();

  /* ---------------- SEAT STYLE ---------------- */
  const getSeatTypeStyle = (seatType, isSelected, isSold) => {
    if (isSold) return 'bg-gray-800/50 cursor-not-allowed text-gray-600 border border-white/5';
    if (isSelected) return 'bg-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-500/50';

    switch (seatType) {
      case 'NORMAL':
        return 'bg-blue-500/20 text-blue-200 border-2 border-blue-500/50 hover:bg-blue-500/30';
      case 'PRIME':
        return 'bg-purple-500/20 text-purple-200 border-2 border-purple-500/50 hover:bg-purple-500/30';
      case 'RECLINER':
        return 'bg-yellow-500/20 text-yellow-200 border-2 border-yellow-500/50 hover:bg-yellow-500/30';
      default:
        return 'bg-white/10 text-gray-300 border border-white/10';
    }
  };

  /* ---------------- SELECTED SEAT NUMBERS (UI) ---------------- */
  const selectedSeatNumbers = [];
  rows.forEach(row => {
    seatsByRow[row]?.forEach(seat => {
      if (selectedSeats.includes(seat.showSeatId)) {
        selectedSeatNumbers.push(seat.seatNumber);
      }
    });
  });

  return (
    <>
    <div className="max-w-5xl mx-auto pt-8 pb-20 px-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white">
          <ChevronLeft size={20} /> Back
        </button>

        <div className="text-right">
          <h3 className="text-white font-bold">{theater?.name}</h3>
          <div className="text-sm text-gray-400 flex gap-3 justify-end">
            <span><CalendarIcon size={14} /> {date}</span>
            <span><Clock size={14} /> {time}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SEATS */}
        <div className="lg:col-span-2 bg-[#1e1e1e] p-8 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-2">Select Your Seats</h2>
          <p className="text-gray-400 mb-6">
            {layoutType} Screen • {availableSeats}/{totalSeats}
          </p>

          {/* Scrollable Seat Container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[500px] pr-2" style={{ scrollbarWidth: 'thin' }}>
            {rows.map(row => (
              <div key={row} className="flex items-center gap-2 mb-2">
                <span className="w-6 text-gray-500 font-bold sticky left-0 bg-[#1e1e1e] z-10">{row}</span>

                <div className="flex gap-2">
                  {seatsByRow[row].map(seat => {
                    const isSold = seat.status !== 'AVAILABLE';
                    const isSelected = selectedSeats.includes(seat.showSeatId);

                    return (
                      <button
                        key={seat.showSeatId}
                        disabled={isSold}
                        onClick={() => onSeatClick(seat.showSeatId)}
                        className={`w-10 h-10 rounded-lg text-xs font-semibold flex-shrink-0
                                                  ${getSeatTypeStyle(seat.seatType, isSelected, isSold)}
                                              `}
                        title={`${seat.seatNumber} - ₹${seat.price}`}
                      >
                        {seat.seatNumber.replace(row, '')}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-white/10 h-fit" style={{ position: 'sticky', top: '7rem' }}>
          <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>

          <div className="space-y-4">
            {/* Seats Display */}
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Seats</p>
              <p className="text-white font-medium">
                {selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(', ') : 'No seats selected'}
              </p>
            </div>

            {/* Total Amount */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Total Amount</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold text-lg">Total</span>
                <span className="text-3xl text-red-500 font-bold">₹{total}</span>
              </div>
            </div>
          </div>

          <button
            disabled={!selectedSeats.length}
            onClick={() => onPayment(total)}
            className="mt-6 w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <CreditCard size={18} /> 
            {selectedSeats.length > 0 ? 'Confirm Payment' : 'Select Seats First'}
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default BookingView;
