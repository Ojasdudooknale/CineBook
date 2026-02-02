
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { getUserBookings } from '../services/userService';
import Footer from '../components/Footer';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        if (response && response.data) {
          const mappedBookings = response.data.map((booking) => ({
            id: booking.bookingId,
            movieTitle: booking.movieTitle,
            movieGenre: booking.genre,
            movieImage: booking.posterUrl || 'https://via.placeholder.com/300x450',
            date: (() => {
              const d = new Date(booking.showTime);
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              return `${day}/${month}/${year}`;
            })(),
            time: new Date(booking.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            theaterName: booking.theatreName,
            seats: ['General'], // Placeholder as backend doesn't provide seats yet
            total: booking.totalAmount,
          }));
          setBookings(mappedBookings);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load your bookings.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">My Bookings</h2>
        <p className="text-gray-400 text-lg mt-2">View your ticket history and upcoming shows.</p>
      </header>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-[#1e1e1e] border border-white/10 rounded-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
            <Ticket size={40} className="text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Bookings Found</h3>
          <p className="text-gray-400 max-w-sm mx-auto">You haven't booked any tickets yet. Go to the dashboard to find a movie you like!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden group hover:border-red-500/50 transition-colors">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={booking.movieImage} 
                  alt={booking.movieTitle} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white leading-tight">{booking.movieTitle}</h3>
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wider mt-1">{booking.movieGenre}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                 <div className="flex items-center gap-3 text-gray-300 text-sm">
                   <Calendar size={16} className="text-gray-500" />
                   <span>{booking.date}</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-300 text-sm">
                   <Clock size={16} className="text-gray-500" />
                   <span>{booking.time}</span>
                 </div>
                 <div className="flex items-center gap-3 text-gray-300 text-sm">
                   <MapPin size={16} className="text-gray-500" />
                   <span>{booking.theaterName}</span>
                 </div>
                 
                 <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Seats</p>
                      <p className="text-white font-medium">{booking.seats.join(', ')}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                       <p className="text-red-500 font-bold">₹{booking.total.toFixed(2)}</p>
                    </div>
                 </div>
                 
                 <div className="pt-2 text-center">
                   <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                     Confirmed • ID: {booking.id}
                   </span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyBookings;
