import React from 'react';
import { Film, Building2, Sparkles } from 'lucide-react';

const AboutUs = () => (
  <div className="min-h-screen bg-[#1a1a1a] pt-24 px-4 pb-12 animate-fade-in">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">About <span className="text-red-600">CineBook</span></h1>
      <p className="text-xl text-gray-400 mb-12 leading-relaxed">
        We are revolutionizing the cinema experience. CineBook is more than just a ticket booking platform; 
        it's a gateway to the magic of movies. Born from a passion for storytelling and technology, 
        we aim to connect movie lovers with their favorite theaters seamlessly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 bg-[#1e1e1e] rounded-2xl border border-white/10">
          <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Film size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">For Movie Buffs</h3>
          <p className="text-gray-400">Discover, book, and enjoy movies with zero hassle.</p>
        </div>
        <div className="p-6 bg-[#1e1e1e] rounded-2xl border border-white/10">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">For Theaters</h3>
          <p className="text-gray-400">Powerful tools to manage screens and boost revenue.</p>
        </div>
        <div className="p-6 bg-[#1e1e1e] rounded-2xl border border-white/10">
          <div className="w-12 h-12 bg-purple-600/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
          <p className="text-gray-400">Constantly pushing the boundaries of cinema tech.</p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutUs;
