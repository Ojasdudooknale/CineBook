import React, { useState, useEffect } from 'react';
import { Search, Film, Star, Clock, Trash2, Edit } from 'lucide-react';
import { getAllMovies, addMovie, updateMovie, updateMovieStatus } from '../../services/adminService';

const MoviesList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [movies, setMovies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); 
    
    // Form State
    const initialFormState = {
        title: "",
        genre: "",
        durationMinutes: "",
        rating: "",
        description: "",
        posterUrl: "",
        videoUrl: "",
        language: "",
        releaseDate: "",
        cast: "",
        crew: "",
        movieStatus: "ACTIVE"
    };

    const [formData, setFormData] = useState(initialFormState);

    const fetchMovies = async () => {
        try {
            const response = await getAllMovies();
            setMovies(response.data.data);
        } catch (error) {
            console.error("Failed to fetch movies", error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleToggleStatus = async (id) => {
        try {
            await updateMovieStatus(id);
            fetchMovies(); // Refresh list
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleEdit = (movie) => {
        setEditingId(movie.movieId); // Endpoint uses movieId
        setFormData({
            title: movie.title || "",
            genre: movie.genre || "",
            durationMinutes: movie.durationMinutes || "",
            rating: movie.rating || "",
            description: movie.description || "",
            posterUrl: movie.posterUrl || "",
            videoUrl: movie.videoUrl || "",
            language: movie.language || "",
            releaseDate: movie.releaseDate || "",
            cast: movie.cast || "",
            crew: movie.crew || "",
            movieStatus: movie.movieStatus || "ACTIVE"
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(initialFormState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateMovie(editingId, formData);
            } else {
                await addMovie(formData);
            }
            fetchMovies();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save movie", error);
        }
    };

    const filteredMovies = movies.filter(movie => 
        (movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (movie.genre && movie.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
         <div className="space-y-6 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Movies Management</h1>
                    <p className="text-gray-400 mt-2">Manage movies database and listings.</p>
                </div>
                <div className="flex gap-4">
                     <button 
                        onClick={() => {
                            setEditingId(null);
                            setFormData(initialFormState);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        + Add Movie
                    </button>
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search movies..." 
                            className="bg-[#1e1e1e] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 w-64 text-sm focus:outline-none focus:border-red-600 transition-colors text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.map((movie) => (
                    <div key={movie.movieId} className="bg-[#1e1e1e] rounded-xl border border-white/5 overflow-hidden group hover:border-white/20 transition-all">
                        <div className="relative h-48 overflow-hidden">
                            <img src={movie.posterUrl || "https://via.placeholder.com/400x300?text=No+Image"} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${movie.movieStatus === 'INACTIVE' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                    {movie.movieStatus || 'ACTIVE'}
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-xl font-bold text-white shadow-sm">{movie.title}</h3>
                                <p className="text-xs text-gray-300 shadow-sm">{movie.genre}</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-500" /> {movie.rating}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={14} /> {movie.durationMinutes} min
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEdit(movie)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button 
                                    onClick={() => handleToggleStatus(movie.movieId)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                        movie.movieStatus === 'INACTIVE' 
                                        ? 'bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20' 
                                        : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20'
                                    }`}
                                >
                                    {movie.movieStatus === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredMovies.length === 0 && (
                <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                    <Film size={48} className="mb-4 opacity-50"/>
                    <p>No movies found matching "{searchTerm}"</p>
                </div>
            )}

            {/* Add/Edit Movie Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1e1e1e]">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? "Edit Movie" : "Add New Movie"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Title</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        required
                                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Genre</label>
                                    <input 
                                        type="text" 
                                        name="genre"
                                        required
                                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                        value={formData.genre}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Duration (in minutes)</label>
                                    <input 
                                        type="number" 
                                        name="durationMinutes"
                                        required
                                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                        value={formData.durationMinutes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Rating (0-10)</label>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        name="rating"
                                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Language</label>
                                    <input 
                                        type="text" 
                                        name="language"
                                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Release Date</label>
                                    <input 
                                        type="date" 
                                        name="releaseDate"
                                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none text-white"
                                        value={formData.releaseDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                 <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Movie Status</label>
                                    <select 
                                        name="movieStatus"
                                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none text-white"
                                        value={formData.movieStatus}
                                        onChange={handleInputChange}
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Cast</label>
                                <input 
                                    type="text" 
                                    name="cast"
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                    placeholder="Actor 1, Actor 2..."
                                    value={formData.cast}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Crew</label>
                                <input 
                                    type="text" 
                                    name="crew"
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                    placeholder="Director, Producer..."
                                    value={formData.crew}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Poster Image URL</label>
                                <input 
                                    type="url" 
                                    name="posterUrl"
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                    placeholder="https://..."
                                    value={formData.posterUrl}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Video URL</label>
                                <input 
                                    type="url" 
                                    name="videoUrl"
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none"
                                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                                    value={formData.videoUrl}
                                    onChange={handleInputChange}
                                />
                                <p className="text-xs text-gray-500">
                                    Supports YouTube URLs (will auto-convert to embed) or direct video file URLs
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Description</label>
                                <textarea 
                                    name="description"
                                    rows="4"
                                    className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2 focus:border-red-500 focus:outline-none resize-none"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <button 
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                                >
                                    {editingId ? "Update Movie" : "Save Movie"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoviesList;
