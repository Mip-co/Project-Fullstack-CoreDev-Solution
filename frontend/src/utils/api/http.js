import axios from "axios";

const http = axios.create({
  baseURL: "/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request (Suntik token otomatis)
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response (Penyembuh Bug Peringatan Sekelibet 🚀)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔑 VALIDASI PINTAR: Jika eror 401 terjadi di endpoint '/login', JANGAN di-refresh/ditendang!
    // Biarkan erornya lolos agar bisa ditangkap oleh blok catch di Login.jsx untuk menampilkan pesan merah Silva.
    const isLoginEndpoint = error.config?.url?.includes("/login");

    if (error.response && error.response.status === 401 && !isLoginEndpoint) {
      console.warn("Sesi internal kedaluwarsa. Mengarahkan gerbang masuk...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    return Promise.reject(error); // Melempar eror agar ditangkap catch(error) di Login.jsx
  }
);

export default http;