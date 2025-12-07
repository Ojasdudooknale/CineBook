import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';

const App = () => (
  <Routes>
    <Route path="/signup" element={<SignUp onSwitchToLogin={() => {}} />} />

    <Route path="*" element={<Navigate to="/signup" replace />} />
  </Routes>
);

export default App;