import React, { useState, useEffect } from 'react';
import { Search, User, Shield, Ban, Trash2, Mail, MoreVertical } from 'lucide-react';
import { getAllUsers, updateUserStatus } from '../../services/adminService';

const UsersList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id) => {
        try {
            await updateUserStatus(id);
            fetchUsers();
        } catch (error) {
            console.error("Failed to update user status", error);
        }
    };

    const filteredUsers = users.filter(user => 
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-gray-400 mt-2">View and manage registered users.</p>
                </div>
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="bg-[#1e1e1e] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 w-64 text-sm focus:outline-none focus:border-red-600 transition-colors text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-black/20 text-gray-400 text-xs uppercase font-bold border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Join Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {filteredUsers.map((user) => (
                            <tr key={user.userId} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{user.firstName} {user.lastName}</h4>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                                                <Mail size={10} /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.userRole === 'ROLE_ADMIN' ? <Shield size={14} className="text-red-500"/> : <User size={14} className="text-gray-500"/>}
                                        <span className={user.userRole === 'ROLE_ADMIN' ? "text-red-400 font-medium" : "text-gray-300"}>
                                            {user.userRole}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                                    {(() => {
                                        const d = new Date(user.createdAt);
                                        const day = String(d.getDate()).padStart(2, '0');
                                        const month = String(d.getMonth() + 1).padStart(2, '0');
                                        const year = d.getFullYear();
                                        return `${day}/${month}/${year}`;
                                    })()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        user.userStatus === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                        {user.userStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleToggleStatus(user.userId)}
                                            className={`p-2 rounded-lg transition-colors ${
                                                user.userStatus === 'DELETED' 
                                                ? 'hover:bg-green-500/10 text-gray-400 hover:text-green-500' 
                                                : 'hover:bg-red-500/10 text-gray-400 hover:text-red-500'
                                            }`}
                                            title={user.userStatus === 'DELETED' ? "Activate" : "Soft Delete"}
                                        >
                                            {user.userStatus === 'DELETED' ? <Shield size={16} /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && (
                     <div className="p-8 text-center text-gray-500">
                        No users found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersList;
