import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { ToastProvider } from './context/ToastContext';
import ErrorPage from './pages/ErrorPage';
import UserView from './pages/UserView';
const App = () => {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userview" element={<UserView />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;