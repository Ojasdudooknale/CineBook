import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Phone, Users2, Loader2, Edit2, Save, X } from 'lucide-react';
import { getCurrentUser, updateUser } from '../services/userService';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const { addToast } = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser();
                setUserData(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                addToast('Failed to load user profile', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [addToast]);

    const handleEdit = () => {
        setFormData(userData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(userData);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await updateUser(formData);
            if (response.success) {
                setUserData(response.data);
                setIsEditing(false);
                addToast('Profile updated successfully', 'success');
            } else {
                addToast(response.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Update failed:', error);
            addToast('Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not provided';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-red-500" />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#1a1a1a] py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <User size={48} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {userData?.firstName && userData?.lastName 
                                ? `${userData.firstName} ${userData.lastName}` 
                                : 'My Profile'}
                        </h1>
                        <p className="text-gray-400 mb-6">View and manage your account information</p>
                        
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors font-medium"
                            >
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={handleSave}
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors font-medium"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors font-medium"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Information Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* First Name */}
                        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-400 text-sm mb-1">First Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#2a2a2a] border border-white/20 rounded px-3 py-1 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    ) : (
                                        <p className="text-white font-semibold text-lg truncate">
                                            {userData?.firstName || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-400 text-sm mb-1">Last Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#2a2a2a] border border-white/20 rounded px-3 py-1 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    ) : (
                                        <p className="text-white font-semibold text-lg truncate">
                                            {userData?.lastName || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Email - Always Read Only */}
                        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 opacity-75">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} className="text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-400 text-sm mb-1">Email Address</p>
                                    <p className="text-white font-semibold truncate">
                                        {userData?.email || 'Not provided'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <Shield size={12} /> Cannot be changed
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} className="text-yellow-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-400 text-sm mb-1">Mobile Number</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="mobileNo"
                                            value={formData.mobileNo || ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#2a2a2a] border border-white/20 rounded px-3 py-1 text-white focus:outline-none focus:border-yellow-500"
                                        />
                                    ) : (
                                        <p className="text-white font-semibold text-lg">
                                            {userData?.mobileNo || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                                    <Users2 size={20} className="text-pink-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-400 text-sm mb-1">Gender</p>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={formData.gender || ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#2a2a2a] border border-white/20 rounded px-3 py-1 text-white focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="text-white font-semibold text-lg">
                                            {userData?.gender || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                    <Calendar size={20} className="text-orange-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-400 text-sm mb-1">Date of Birth</p>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob ? formData.dob.split('T')[0] : ''}
                                            onChange={handleChange}
                                            className="w-full bg-[#2a2a2a] border border-white/20 rounded px-3 py-1 text-white focus:outline-none focus:border-orange-500 text-sm"
                                        />
                                    ) : (
                                        <>
                                            <p className="text-white font-semibold">
                                                {formatDate(userData?.dob)}
                                            </p>
                                            {userData?.dob && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Age: {calculateAge(userData.dob)} years
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-red-500" />
                            Account Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Account Type</p>
                                <p className="text-white font-semibold mt-1">
                                    {userData?.userRole === 'ROLE_USER' ? 'User' : 
                                     userData?.userRole === 'ROLE_OWNER' ? 'Theatre Owner' : 
                                     userData?.userRole === 'ROLE_ADMIN' ? 'Administrator' : 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Account Status</p>
                                <p className={`font-semibold mt-1 ${
                                    userData?.userStatus === 'ACTIVE' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {userData?.userStatus || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Member Since</p>
                                <p className="text-white font-semibold mt-1">
                                    {formatDate(userData?.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

};

export default UserProfile;
