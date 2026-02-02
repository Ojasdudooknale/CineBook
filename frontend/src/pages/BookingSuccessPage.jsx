import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import bookingService from "../services/bookingService";
import Footer from "../components/Footer";

const BookingSuccessPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const bookingId = state?.bookingId;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) return;

        const fetchBooking = async () => {
            try {
                const response = await bookingService.getBookingById(bookingId);
                setBooking(response.data); // ApiResponse.data
            } catch (err) {
                console.error("Failed to fetch booking", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">
                Loading booking details...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">
                Booking not found
            </div>
        );
    }

    return (
        <>
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-3xl p-10 max-w-lg w-full">
                <div className="text-center mb-6">
                    <CheckCircle size={72} className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">
                        Booking Confirmed 🎉
                    </h1>
                </div>

                <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                        <span>Booking ID</span>
                        <span className="text-white font-semibold">
                            #{booking.bookingId}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Movie</span>
                        <span className="text-white">{booking.movieTitle}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Theatre</span>
                        <span className="text-white">
                            {booking.theatreName} (Screen {booking.screenNumber})
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Show Time</span>
                        <span className="text-white">
                            {(() => {
                                const d = new Date(booking.showTime);
                                const day = String(d.getDate()).padStart(2, '0');
                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                const year = d.getFullYear();
                                const hours = String(d.getHours()).padStart(2, '0');
                                const minutes = String(d.getMinutes()).padStart(2, '0');
                                return `${day}/${month}/${year} ${hours}:${minutes}`;
                            })()}
                        </span>
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-3 mt-3">
                        <span className="font-semibold">Total Paid</span>
                        <span className="text-green-400 font-bold">
                            ₹{booking.totalAmount}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold"
                    >
                        Home
                    </button>

                    <button
                        onClick={() => navigate("/my-bookings")}
                        className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold"
                    >
                        My Bookings
                    </button>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default BookingSuccessPage;
