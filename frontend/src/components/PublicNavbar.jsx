import React from 'react';
import { Film } from 'lucide-react';

const PublicNavbar = () => (
  <nav className="absolute top-0 left-0 right-0 z-50 p-6">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-red-600 to-red-800 p-2 rounded-xl shadow-lg shadow-red-900/40">
          <Film className="text-white h-6 w-6" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-white">
          CineBook<span className="text-red-500">.</span>
        </span>
      </div>
    </div>
  </nav>
);

export default PublicNavbar;