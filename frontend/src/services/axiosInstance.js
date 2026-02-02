import axios from "axios";
import { store } from "../store/store";
import { logout as logoutRedux } from "../store/authSlice";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080", // change if needed
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//auto-logout on 401 i.e when token expires
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Check if we're in the booking flow
            const currentPath = window.location.pathname;
            const isBookingFlow = currentPath.includes('/booking-success') || 
                                  currentPath.includes('/movie/seats');
            
            // Only clear auth and redirect if NOT in booking flow
            if (!isBookingFlow) {
                // Clear Redux + localStorage
                store.dispatch(logoutRedux());
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                
                // Redirect to login
                window.location.href = "/login";
            }
            // If in booking flow, just pass the error through without clearing auth
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
