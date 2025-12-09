import React, { useState } from 'react';
import { ChevronLeft, Building2, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_MOVIES, MOCK_THEATERS } from '../data/mockData';

const TheaterSelectionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Find the movie from mock data based on ID
    const movie = MOCK_MOVIES.find(m => m.id === Number(id));

    // Generate Next 3 Days
    const getNext3Days = () => {
        const dates = [];
        for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            full: d.toISOString().split('T')[0],
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
        });
        }
        return dates;
    };

    const dateOptions = getNext3Days();
    const [selectedDate, setSelectedDate] = useState(dateOptions[0].full);

    // --- Handlers ---
    const handleBack = () => {
        navigate(-1);
    }
    const handleTimeSelect = (theater, time) => console.log(`Selected ${theater.name} at ${time}`);

    if (!movie) {
        return <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">Movie not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
        <div className="max-w-4xl mx-auto pt-8 pb-20">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-4">
            <button 
                onClick={handleBack} 
                className="flex items-center text-gray-400 hover:text-white group"
            >
                <ChevronLeft size={20} className="mr-1" /> Back to Movie
            </button>
            <div className="text-right">
                <h2 className="text-xl font-bold text-white">{movie.title}</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{movie.duration} • {movie.genre}</p>
            </div>
            </div>

            {/* Date Selector Strip */}
            <div className="mb-8 px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {dateOptions.map((dateObj) => (
                <button
                    key={dateObj.full}
                    onClick={() => setSelectedDate(dateObj.full)}
                    className={`
                    flex flex-col items-center justify-center min-w-[5rem] px-4 py-3 rounded-xl border transition-all duration-300
                    ${selectedDate === dateObj.full 
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                    }
                    `}
                >
                    <span className="text-xs font-medium uppercase tracking-wider mb-1 opacity-80">{dateObj.day}</span>
                    <span className="text-xl font-bold">{dateObj.date}</span>
                </button>
                ))}
            </div>
            </div>

            {/* Theater List */}
            <div className="space-y-4 px-4">
            {MOCK_THEATERS.map((theater) => (
                <div key={theater.id} className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    
                    {/* Theater Info */}
                    <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-800 rounded-xl text-gray-400 group-hover:text-red-500 transition-colors">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-400 transition-colors">{theater.name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={14} /> {theater.location}
                        </div>
                    </div>
                    </div>

                    {/* Time Pills */}
                    <div className="flex flex-wrap gap-3">
                    {theater.times.map((time, idx) => (
                        <button
                        key={idx}
                        onClick={() => handleTimeSelect(theater, time)}
                        className="px-4 py-2 rounded-lg border border-green-500/30 text-green-400 text-sm font-medium hover:bg-red-600 hover:border-red-600 hover:text-white transition-all"
                        >
                        {time}
                        </button>
                    ))}
                    </div>

                </div>
                </div>
            ))}
            </div>

        </div>
        </div>
    );
};

export default TheaterSelectionPage;
