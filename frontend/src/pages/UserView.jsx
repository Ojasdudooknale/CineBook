import React, { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { useNavigate } from 'react-router-dom';

import { MOCK_MOVIES, MOCK_THEATERS } from '../data/mockData';

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance']; // Add your genres here

const CustomerView = () => {
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const navigate = useNavigate();


    const filteredMovies = MOCK_MOVIES.filter((movie) => {
        const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    return (
        <>
            <PublicNavbar />
            <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center p-4 pt-24 relative overflow-hidden">
                <div className="w-full max-w-5xl mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                        Now Showing
                    </h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500 placeholder:text-gray-600"
                        />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                        <div className="flex gap-2">
                            {['All', ...GENRES].map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-2 rounded-xl text-white border border-white/10 ${selectedGenre === genre ? 'bg-orange-500' : 'bg-[#1e1e1e] hover:bg-red-600'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredMovies.map((movie) => (
                        <div key={movie.id} className="bg-[#1e1e1e] border border-white/10 p-4 rounded-3xl flex flex-col justify-between h-full">
                            <div>
                                <img
                                    src={movie.image}
                                    alt={movie.title}
                                    className="rounded-xl mb-4 w-full h-48 object-cover"
                                />
                                <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
                                <p className="text-gray-400 text-sm mb-2">{movie.genre}</p>
                                <p className="text-gray-400 text-sm mb-4">{movie.desc}</p>
                            </div>
                            <button
                                onClick={() => navigate(`/movie/${movie.id}`)}
                                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>


            </div>
        </>
    );
};

export default CustomerView;