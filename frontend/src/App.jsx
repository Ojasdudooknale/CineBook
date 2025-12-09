import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import { ToastProvider } from './context/ToastContext';
import ErrorPage from './pages/ErrorPage';
import UserView from './pages/UserView';
import MovieDetailPage from './pages/MovieDetailPage';
import TermsAndServices from './pages/TermsAndServices';
import TheaterSelectionPage from './pages/TheaterSelectionPage';

const App = () => {
  return (
    <ToastProvider>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" replace />} />

        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/userview" element={<UserView />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/terms-and-services" element={<TermsAndServices />} />
        {/* Route for theater selection linked to specific movie */}
        <Route path="/book/:id" element={<TheaterSelectionPage />} />

        
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;
