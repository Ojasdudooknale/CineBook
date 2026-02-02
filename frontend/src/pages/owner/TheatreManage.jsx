import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Film, Plus, X, Loader, Trash2 } from 'lucide-react';
import ownerService from '../../services/ownerService';
import { getAllMovies } from '../../services/movieService';
import { useToast } from '../../context/ToastContext';

const TheatreManage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('screens');
    const [theatre, setTheatre] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shows, setShows] = useState([]);

    // Modal States
    const [showScreenModal, setShowScreenModal] = useState(false);
    const [showShowModal, setShowShowModal] = useState(false);
    const [movies, setMovies] = useState([]);
    
    // Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [editingScreenId, setEditingScreenId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Screen Form Data
    const [screenData, setScreenData] = useState({
        layoutType: '',
        rowConfig: {}
    });

    // Show Form Data
    const [showData, setShowData] = useState({
        screenId: '',
        movieId: '',
        showTime: '',
        seatTypePrices: {
            NORMAL: '',
            PRIME: '',
            RECLINER: ''
        }
    });

    // Fetch movies helper
    const fetchMovies = async () => {
        try {
            const response = await getAllMovies();
            setMovies(response.data || []); 
        } catch (error) {
            console.error("Failed to fetch movies", error);
        }
    };

    const openShowModal = () => {
        if(movies.length === 0) fetchMovies();
        setShowData({
             screenId: '',
             movieId: '',
             showTime: '',
             seatTypePrices: { NORMAL: '', PRIME: '', RECLINER: '' }
        });
        setShowShowModal(true);
    };

    const handleShowSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log("=== DEBUG ===" );
        console.log("showData:", showData);
        console.log("seatTypePrices:", showData.seatTypePrices);

        // Filter out empty prices and convert to numbers
        const priceMap = {};
        if (showData.seatTypePrices.NORMAL) priceMap.NORMAL = parseFloat(showData.seatTypePrices.NORMAL);
        if (showData.seatTypePrices.PRIME) priceMap.PRIME = parseFloat(showData.seatTypePrices.PRIME);
        if (showData.seatTypePrices.RECLINER) priceMap.RECLINER = parseFloat(showData.seatTypePrices.RECLINER);

        // Ensure datetime is in ISO format
        const showTimeISO = new Date(showData.showTime).toISOString();

        const payload = {
            screenId: parseInt(showData.screenId),
            movieId: parseInt(showData.movieId),
            showTime: showTimeISO,
            seatTypePrices: priceMap
        };

        console.log("Sending payload:", payload); // Debug log

        try {
            await ownerService.addShow(payload);
            addToast("Show scheduled successfully!", "success");
            setShowShowModal(false);
            fetchShows(); // Refresh shows list
        } catch(error) {
            console.error("Add Show Failed", error);
            addToast(error.response?.data?.message || "Failed to schedule show", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to generate row labels based on layout
    const getRowsForLayout = (type) => {
        let count = 0;
        if (type === 'SMALL') count = 8;
        else if (type === 'MEDIUM') count = 10;
        else if (type === 'LARGE') count = 12;
        
        return Array.from({ length: count }, (_, i) => String.fromCharCode(65 + i)); // A, B, C...
    };

    const generatedRows = getRowsForLayout(screenData.layoutType);

    const handleRowConfigChange = (row, value) => {
        setScreenData(prev => ({
            ...prev,
            rowConfig: {
                ...prev.rowConfig,
                [row]: value
            }
        }));
    };

    const fetchTheatreDetails = async () => {
        setIsLoading(true);
        try {
            const data = await ownerService.getTheatreById(id);
            setTheatre(data);
        } catch (error) {
            console.error("Failed to fetch theatre details", error);
            addToast("Failed to load theatre details", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTheatreDetails();
        fetchShows();
    }, [id]);

    const fetchShows = async () => {
        try {
            const data = await ownerService.getShows(id);
            setShows(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch shows", error);
            setShows([]);
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingScreenId(null);
        setScreenData({ layoutType: '', rowConfig: {} });
        setShowScreenModal(true);
    };

    const openEditModal = (screen) => {
        setIsEditing(true);
        setEditingScreenId(screen.screenId);
        // We don't have rowConfig stored in screen entity response easily to pre-fill detailed config 
        // without fetching seats and reverse engineering.
        // For now, we will pre-fill LayoutType. 
        // RowConfig will start empty/default, forcing user to re-configure if they want changes.
        // Enhancing this would require fetching screen active seat config.
        setScreenData({ 
            layoutType: screen.layoutType, 
            rowConfig: {} 
        });
        setShowScreenModal(true);
    };

    const handleScreenSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const payload = {
            layoutType: screenData.layoutType,
            rowConfig: Object.keys(screenData.rowConfig).length > 0 ? screenData.rowConfig : null
        };

        try {
            if (isEditing) {
                await ownerService.updateScreen(editingScreenId, payload);
                addToast("Screen updated successfully!", "success");
            } else {
                await ownerService.addScreen(id, payload);
                addToast("Screen added successfully!", "success");
            }
            setShowScreenModal(false);
            setScreenData({ 
                layoutType: '', 
                rowConfig: {}
            });
            fetchTheatreDetails();
        } catch (error) {
            console.error("Failed to save screen", error);
            addToast(`Failed to ${isEditing ? 'update' : 'add'} screen`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteScreen = async (screenId) => {
        if(!window.confirm("Are you sure you want to remove this screen?")) return;
        try {
            await ownerService.deleteScreen(screenId);
            addToast("Screen removed successfully", "success");
            fetchTheatreDetails(); 
        } catch (error) {
            console.error("Delete failed", error);
           addToast("Failed to remove screen", "error");
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader className="animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-fade-in text-white min-h-screen">
             {/* Header */}
             <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/owner/theatres')}
                    className="bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold">{theatre?.theatreName}</h1>
                    <p className="text-gray-400">Manage Screens & Shows</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10">
                <button 
                    onClick={() => setActiveTab('screens')}
                    className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'screens' ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
                >
                    Screens
                    {activeTab === 'screens' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('shows')}
                    className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'shows' ? 'text-purple-500' : 'text-gray-400 hover:text-white'}`}
                >
                    Shows
                    {activeTab === 'shows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-t-full"></div>}
                </button>
            </div>

            {/* Content Active Tab */}
            {activeTab === 'screens' && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Screens ({theatre?.screens?.length || 0})</h2>
                        <button 
                            onClick={openAddModal}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors"
                        >
                            <Plus size={18} /> Add Screen
                        </button>
                    </div>

                    {(!theatre?.screens || theatre.screens.length === 0) ? (
                        <div className="bg-[#1e1e1e] p-10 rounded-2xl border border-white/10 text-center">
                            <Monitor size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400">No screens added yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {theatre.screens.map((screen) => (
                                <div key={screen.screenId} className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 flex justify-between items-start group">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Screen {screen.screenNumber}</h3>
                                        <div className="flex gap-4 text-sm text-gray-400">
                                             <span>Type: {screen.layoutType || 'Standard'}</span>
                                             <span>Seats: {screen.totalSeats || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => openEditModal(screen)}
                                            className="text-gray-400 hover:text-purple-400 transition-colors p-2"
                                            title="Edit Screen"
                                        >
                                            <Monitor size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteScreen(screen.screenId)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            title="Delete Screen"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'shows' && (
                 <div className="animate-fade-in">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Shows ({shows.length})</h2>
                         <button 
                            onClick={openShowModal}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors"
                        >
                            <Plus size={18} /> Add Show
                        </button>
                    </div>
                    
                    {shows.length === 0 ? (
                        <div className="bg-[#1e1e1e] p-10 rounded-2xl border border-white/10 text-center">
                            <Film size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400">No shows scheduled yet.</p>
                            <p className="text-gray-500 text-sm mt-2">Click "Add Show" to schedule a new show.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shows.map((show) => (
                                <div key={show.showId} className="bg-[#1e1e1e] p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 p-2.5 rounded-lg">
                                            <Film size={20} className="text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white mb-1">{show.movie?.title || 'Unknown Movie'}</h3>
                                            <p className="text-xs text-gray-500">Screen {show.screen?.screenNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Show Time:</span>
                                            <span className="text-white font-medium">
                                                {show.showTime ? (() => {
                                                    const d = new Date(show.showTime);
                                                    const day = String(d.getDate()).padStart(2, '0');
                                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                                    const year = d.getFullYear();
                                                    const hours = String(d.getHours()).padStart(2, '0');
                                                    const minutes = String(d.getMinutes()).padStart(2, '0');
                                                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                                                })() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Status:</span>
                                            <span className={`font-medium ${show.showStatus === 'ACTIVE' ? 'text-green-400' : 'text-gray-400'}`}>
                                                {show.showStatus || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
            )}

            {/* Add Screen Modal */}
            {showScreenModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
                     <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl p-6 relative my-8">
                        <button 
                            onClick={() => setShowScreenModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold mb-1">{isEditing ? 'Edit Screen' : 'Add New Screen'}</h2>
                        <p className="text-gray-400 text-sm mb-6">Configure the screen layout and seating.</p>

                        <form onSubmit={handleScreenSubmit} className="space-y-4">
                            
                            {/* Layout Type */}
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Layout Type</label>
                                <select
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                                    value={screenData.layoutType}
                                    onChange={(e) => setScreenData({...screenData, layoutType: e.target.value})}
                                >
                                    <option value="" disabled>Select Layout Size</option>
                                    <option value="SMALL">Small (80 Seats: 8 Rows × 10 Columns)</option>
                                    <option value="MEDIUM">Medium (150 Seats: 10 Rows × 15 Columns)</option>
                                    <option value="LARGE">Large (240 Seats: 12 Rows × 20 Columns)</option>
                                </select>
                            </div>

                            {/* Row Configuration Helper */}
                            {/* Row Configuration Helper */}
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Seat Configuration (Per Row)</label>
                                <div className="space-y-3 bg-[#0a0a0a] p-4 rounded-xl border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <div className="text-xs text-gray-400 mb-3 bg-white/5 p-2 rounded">
                                        <span className="font-bold text-purple-400">Instructions:</span> Select seat type for each row.
                                    </div>
                                    
                                    {!screenData.layoutType ? (
                                        <div className="text-center text-gray-600 text-sm py-4">
                                            Please select a Layout Type first to configure rows.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {generatedRows.map((row) => (
                                                <div key={row} className="flex items-center justify-between bg-[#1e1e1e] border border-white/10 p-2 rounded-lg">
                                                    <span className="text-white font-bold w-12 text-center bg-white/5 rounded py-1">{row}</span>
                                                    <select
                                                        className="bg-transparent text-sm text-white focus:outline-none focus:text-purple-400 text-right cursor-pointer"
                                                        value={screenData.rowConfig?.[row] || 'NORMAL'}
                                                        onChange={(e) => handleRowConfigChange(row, e.target.value)}
                                                    >
                                                        <option value="NORMAL" className="bg-[#1e1e1e]">NORMAL</option>
                                                        <option value="PRIME" className="bg-[#1e1e1e]">PRIME</option>
                                                        <option value="RECLINER" className="bg-[#1e1e1e]">RECLINER</option>
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-all mt-4 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? <Loader className="animate-spin" size={20} /> : (isEditing ? <Monitor size={20} /> : <Plus size={20} />)}
                                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Screen' : 'Create Screen')}
                            </button>
                        </form>
                     </div>
                </div>
            )}

            {/* Add Show Modal */}
            {showShowModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
                     <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl p-6 relative my-8">
                        <button 
                            onClick={() => setShowShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold mb-1">Schedule New Show</h2>
                        <p className="text-gray-400 text-sm mb-6">Select move, screen and set pricing.</p>

                        <form onSubmit={handleShowSubmit} className="space-y-4">
                            
                            {/* Movie Select */}
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Select Movie</label>
                                <select
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                                    value={showData.movieId}
                                    onChange={(e) => setShowData({...showData, movieId: e.target.value})}
                                >
                                    <option value="" disabled>Choose a Movie</option>
                                    {movies.map(movie => (
                                        <option key={movie.movieId} value={movie.movieId}>{movie.title} ({movie.language})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Screen Select */}
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Select Screen</label>
                                <select
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                                    value={showData.screenId}
                                    onChange={(e) => setShowData({...showData, screenId: e.target.value})}
                                >
                                    <option value="" disabled>Choose a Screen</option>
                                    {theatre?.screens?.map(screen => (
                                        <option key={screen.screenId} value={screen.screenId}>Screen {screen.screenNumber} ({screen.layoutType})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Show Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Show Time</label>
                                <input 
                                    type="datetime-local" 
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    value={showData.showTime}
                                    onChange={(e) => setShowData({...showData, showTime: e.target.value})}
                                />
                            </div>

                            {/* Pricing */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Ticket Pricing (₹)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Normal</label>
                                        <input 
                                            type="number" 
                                            placeholder="200"
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                            value={showData.seatTypePrices.NORMAL || ''}
                                            onChange={(e) => {
                                                console.log("NORMAL onChange fired, value:", e.target.value);
                                                setShowData({
                                                    ...showData, 
                                                    seatTypePrices: { ...showData.seatTypePrices, NORMAL: e.target.value } 
                                                });
                                            }}
                                        />
                                    </div>
                                     <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Prime</label>
                                        <input 
                                            type="number" 
                                            placeholder="350"
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                            value={showData.seatTypePrices.PRIME || ''}
                                            onChange={(e) => setShowData({
                                                ...showData, 
                                                seatTypePrices: { ...showData.seatTypePrices, PRIME: e.target.value } 
                                            })}
                                        />
                                    </div>
                                     <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Recliner</label>
                                        <input 
                                            type="number" 
                                            placeholder="500"
                                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                            value={showData.seatTypePrices.RECLINER || ''}
                                            onChange={(e) => setShowData({
                                                ...showData, 
                                                seatTypePrices: { ...showData.seatTypePrices, RECLINER: e.target.value } 
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-all mt-4 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? <Loader className="animate-spin" size={20} /> : <Film size={20} />}
                                {isSubmitting ? 'Scheduling...' : 'Create Show'}
                            </button>
                        </form>
                     </div>
                </div>
            )}

        </div>
    );
};

export default TheatreManage;
