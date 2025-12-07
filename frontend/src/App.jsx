import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

const App = () => (
  <Routes>
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;