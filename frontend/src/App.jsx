import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import { ToastProvider } from './context/ToastContext';

const App = () => {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/signup" element={<SignUp />} />c
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;