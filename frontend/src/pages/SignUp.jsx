import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Phone, Smile, ChevronDown, Calendar, Lock } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

// Signup form with role toggle (Customer/Theater Owner)
const SignUp = () => {
  // Common fields for user and theater owner
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
    theaterName: '',
    address: '',
    city: '',
    zip: ''
  });

  const navigate = useNavigate();

  // Generic change handler for inputs/selects
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Switch between Customer and Theater Owner roles
  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  // Submit handler with password check
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // TODO: replace with real submit logic!
    console.log('Sign up data:', formData);
  };

  return (
    <>
    <PublicNavbar />
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      <div className="w-full max-w-2xl bg-[#1e1e1e] border border-white/10 p-8 rounded-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg shadow-purple-900/40 mb-4">
            <UserPlus className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2">Join CineBook to experience the magic.</p>
        </div>

        {/* Role toggle */}
        <div className="flex bg-[#0a0a0a] border border-white/10 p-1 rounded-xl mb-8 relative">
          <button
            type="button"
            onClick={() => handleRoleChange('Customer')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm relative z-10 ${formData.role === 'Customer' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('Theater Owner')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm relative z-10 ${formData.role === 'Theater Owner' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Theater Owner
          </button>
          {/* Sliding highlight for active role */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 border border-white/10 rounded-lg ${formData.role === 'Theater Owner' ? 'translate-x-full' : 'translate-x-0'}`}
          />
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">First Name</label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                placeholder="Yogesh"
                required
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Last Name</label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                placeholder="Kolhe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                placeholder="yogeshkohle@sunbeam.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                  placeholder="9921573539"
                  required
                />
              </div>
            </div>
            {/* DOB */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 [&::-webkit-calendar-picker-indicator]:invert"
                  required
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Gender</label>
            <div className="relative">
              <Smile className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 appearance-none"
                required
              >
                <option value="" disabled className="text-gray-500">Select Gender</option>
                <option value="Male" className="bg-[#1a1a1a]">Male</option>
                <option value="Female" className="bg-[#1a1a1a]">Female</option>
                <option value="Other" className="bg-[#1a1a1a]">Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Theater Owner fields (conditional) */}
          {formData.role === 'Theater Owner' && (
            <div className="space-y-5 border-t border-white/10 pt-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Theater Name</label>
                <input
                  type="text"
                  name="theaterName"
                  value={formData.theaterName}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                  placeholder="Grand Cinema Plex"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Theater Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                  placeholder="123 Movie Lane"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                    placeholder="Pune"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Zip Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                    placeholder="411057"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {formData.role === 'Theater Owner' ? 'Register Theater' : 'Create Account'}
          </button>
        </form>

        {/* Footer link to switch to login */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-all"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUp;