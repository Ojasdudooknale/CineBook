import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieDetailView from '../components/movie/MovieDetailView';
import { getMovieById } from '../services/movieService';

const MovieDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();


    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await getMovieById(id);
                if (response && response.data) {
                    const backendMovie = response.data;
                    setMovie({
                        id: backendMovie.movieId,
                        title: backendMovie.title,
                        genre: backendMovie.genre,
                        rating: backendMovie.rating,
                        duration: `${backendMovie.durationMinutes} mins`,
                        desc: backendMovie.description,
                        cast: backendMovie.cast ? backendMovie.cast.split(',') : [],
                        director: backendMovie.crew, // Assuming crew field contains director for now
                        producer: 'Unknown', // Placeholder as backend doesn't differentiate yet
                        image: backendMovie.posterUrl || 'https://via.placeholder.com/1280x720',
                        videoUrl: backendMovie.videoUrl,
                    });
                } else {
                    setError("Movie not found");
                }
            } catch (err) {
                console.error("Error fetching movie:", err);
                setError("Failed to load movie details");
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-white">{error}</div>;




    return (
        <MovieDetailView
            movie={movie}
            onBack={() => navigate(-1)}
            onBookTicket={() => navigate(`/book/${movie.id}`)}
        />
    );
};

export default MovieDetailPage;
