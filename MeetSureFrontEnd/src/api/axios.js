// src/api/axios.js
import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }

        // ✅ 加入 log 確認 token 與 header
        console.log("🔐 Axios Request Interceptor");
        console.log("➡️  URL:", config.url);
        console.log("🪪 Token:", token);
        console.log("📦 Headers:", config.headers);

        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
