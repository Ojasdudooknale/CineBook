import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieDetailView from '../components/movie/MovieDetailView';
import { MOCK_MOVIES } from '../data/mockData';

const MovieDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();


    const movie = MOCK_MOVIES.find(m => m.id === Number(id));


    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Movie not found
            </div>
        );
    }

    return (
        <MovieDetailView
            movie={movie}
            onBack={() => navigate(-1)}
            onBookTicket={() => navigate(`/book/${movie.id}`)}
        />
    );
};

export default MovieDetailPage;
