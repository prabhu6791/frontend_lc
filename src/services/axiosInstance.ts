import axios from "axios";

const BASE_URL = "http://localhost:3002";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor (attach token)
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (
                error.response.status === 401 ||
                (error.response.data.message &&
                    error.response.data.message.toLowerCase().includes("token expired"))
            ) {
                alert("You have been logged out due to inactivity or token expiration.")
                localStorage.clear();

                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
