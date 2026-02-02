import React, { useState, useEffect } from 'react';
import { Check, X, MapPin, Building2, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getPendingTheatres, approveTheatre } from '../../services/adminService';

const PendingApprovals = () => {
    const { addToast } = useToast(); 
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const response = await getPendingTheatres();
            setRequests(response.data.data);
        } catch (error) {
            console.error("Failed to fetch pending requests", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const isApproved = newStatus === 'Active';
            await approveTheatre(id, isApproved);
            
            // Optimistic update or refresh
            setRequests(prev => prev.filter(req => req.theatreId !== id));
            
            if (isApproved) {
                addToast('Theater registration approved successfully', 'success');
            } else {
                addToast('Theater registration rejected', 'info');
            }
        } catch (error) {
            console.error("Failed to update status", error);
            addToast('Failed to update status', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pending Approvals</h1>
                <p className="text-gray-400 mt-2">Manage new theater registration requests.</p>
            </div>

            <div className="grid gap-4">
                {requests.length === 0 ? (
                    <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-white/5">
                        <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No pending requests</h3>
                        <p className="text-gray-500">All caught up! Check back later.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.theatreId} className="bg-[#1e1e1e] p-6 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <Building2 size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{req.theatreName}</h3>
                                    <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> {req.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {(() => {
                                                const d = new Date(req.createdAt);
                                                const day = String(d.getDate()).padStart(2, '0');
                                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                                const year = d.getFullYear();
                                                return `${day}/${month}/${year}`;
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button 
                                    onClick={() => handleStatusUpdate(req.theatreId, 'Active')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <Check size={18} />
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(req.theatreId, 'Rejected')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 px-6 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PendingApprovals;
