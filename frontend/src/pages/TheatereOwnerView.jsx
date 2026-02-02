import React, { useState } from 'react';
import { Plus, DollarSign, Ticket, Monitor, Clock, X } from 'lucide-react';
import { MOCK_MOVIES, MOCK_STATS, MOCK_SHOWS } from '../data/mockData.js';

const TheaterOwnerView = ({ addToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local state for visual interactivity (resets on refresh)
  const [shows, setShows] = useState(MOCK_SHOWS);
  const [newShow, setNewShow] = useState({ movie: '', time: '', screen: '' });

  const handleAddShow = (e) => {
    e.preventDefault();
    if (!newShow.movie || !newShow.time || !newShow.screen) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    setShows([
      ...shows,
      {
        id: Date.now(),
        ...newShow,
        occupancy: '0/60',
      },
    ]);
    setIsModalOpen(false);
    setNewShow({ movie: '', time: '', screen: '' });
    addToast('New show added successfully', 'success');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 bg-[#1a1a1a] p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-2">Theater Dashboard</h2>
          <p className="text-gray-400 text-lg">Manage your screens and shows with ease.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold"
        >
          <Plus size={20} /> Add Show
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[ // Fixed the array syntax here
          {
            label: 'Total Revenue',
            value: `₹${MOCK_STATS.revenue}`,
            icon: DollarSign,
            color: 'text-green-400',
            bg: 'bg-green-500/10',
          },
          {
            label: 'Tickets Sold',
            value: MOCK_STATS.ticketsSold,
            icon: Ticket,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
          },
          {
            label: 'Active Screens',
            value: MOCK_STATS.activeScreens,
            icon: Monitor,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
          }
        ].map((stat, index) => (
          <div key={index} className="bg-[#1e1e1e] p-6 rounded-2xl border border-white/10 flex items-center gap-5">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon size={28} className={stat.color} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/10 overflow-hidden shadow-md">
        <div className="px-8 py-6 border-b border-white/10 bg-[#0a0a0a]">
          <h3 className="font-bold text-xl text-white">Current Shows</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0a] text-gray-400 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-5">Movie Title</th>
                <th className="px-8 py-5">Time</th>
                <th className="px-8 py-5">Screen</th>
                <th className="px-8 py-5">Occupancy</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {shows.map((show) => (
                <tr key={show.id} className="hover:bg-white/5 text-sm">
                  <td className="px-8 py-5 font-bold text-white text-base">{show.movie}</td>
                  <td className="px-8 py-5 text-gray-300 flex items-center gap-2">
                    <Clock size={16} className="text-red-500" /> {show.time}
                  </td>
                  <td className="px-8 py-5 text-gray-300">Screen {show.screen}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{
                            width: `${(parseInt(show.occupancy.split('/')[0]) / parseInt(show.occupancy.split('/')[1])) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-400 text-xs font-mono">{show.occupancy}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      Selling
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/90">
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-white mb-8">Add New Show</h3>
            <form onSubmit={handleAddShow} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Movie Title</label>
                <select
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                  value={newShow.movie}
                  onChange={(e) => setNewShow({ ...newShow, movie: e.target.value })}
                  required
                >
                  <option value="">Select a movie...</option>
                  {MOCK_MOVIES.map((m) => (
                    <option key={m.id} value={m.title}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Time</label>
                  <input
                    type="time"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    value={newShow.time}
                    onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Screen</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Enter screen number"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                    value={newShow.screen}
                    onChange={(e) => setNewShow({ ...newShow, screen: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl"
                >
                  Create Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheaterOwnerView;