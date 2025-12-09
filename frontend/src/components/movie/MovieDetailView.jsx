import React from 'react';
import { ChevronLeft, Star, Clock, Film, Users, Ticket } from 'lucide-react';
import PublicNavbar from '../PublicNavbar';

const MovieDetailView = ({ movie, onBack, onBookTicket }) => {
    return (
        <>
            <div className="relative min-h-screen bg-[#1a1a1a] -mt-12">

                {/* 1. Hero Section (Trailer) */}
                <div className="relative w-full aspect-video bg-black sticky top-20 z-0">
                    {/* Floating Back Button */}
                    <button
                        onClick={onBack}
                        className="absolute top-24 left-6 z-30 flex items-center gap-2 px-4 py-2 bg-black hover:bg-red-600/80 rounded-full text-white border border-white/10 group"
                    >
                        <ChevronLeft size={20} className="mr-1" /> Back
                    </button>

                    <iframe
                        className="w-full h-full object-cover"
                        src={`https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${movie.trailerId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* 2. Scrollable Content Area */}
                <div className="relative z-10 bg-[#1a1a1a] -mt-32 pt-12 pb-32 rounded-t-3xl border-t border-white/5">
                    <div className="max-w-5xl mx-auto px-6 sm:px-8">

                        {/* Title & Synopsis */}
                        <div className="mb-12">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">{movie.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300 mb-8">
                                <span className="px-3 py-1 bg-white/10 rounded-full border border-white/10 uppercase tracking-wide text-xs">{movie.genre}</span>
                                <div className="flex items-center gap-1 text-yellow-400"><Star size={16} fill="currentColor" /> {movie.rating}</div>
                                <div className="flex items-center gap-1 text-gray-400"><Clock size={16} /> {movie.duration}</div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><Film size={20} className="text-red-500" /> Synopsis</h3>
                            <p className="text-gray-300 leading-relaxed text-lg opacity-90 max-w-4xl">
                                {movie.desc} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </p>
                        </div>

                        {/* Cast & Crew Section */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Users size={20} className="text-red-500" /> Top Cast</h3>
                            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                {movie.cast.map((actor, index) => (
                                    <div key={index} className="flex flex-col items-center gap-3 min-w-[100px]">
                                        <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-white/10 overflow-hidden">
                                            <img
                                                src={`https://i.pravatar.cc/150?u=${actor.replace(" ", "")}`}
                                                alt={actor}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-300 font-medium text-center leading-tight">{actor}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Production Details */}
                        <div className="p-6 bg-[#1e1e1e] rounded-2xl border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Production Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Director</span>
                                    <span className="text-white font-medium">{movie.director}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Producer</span>
                                    <span className="text-white font-medium">{movie.producer}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. Sticky Booking Footer */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-white/10 p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                        <div className="hidden sm:block">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Booking For</p>
                            <h3 className="text-xl font-bold text-white truncate max-w-xs">{movie.title}</h3>
                        </div>
                        <button
                            onClick={onBookTicket}
                            className="flex-1 sm:flex-none sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                            <Ticket size={20} /> Book Ticket
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default MovieDetailView;
