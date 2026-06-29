import { createContext, useState, useEffect, useContext } from "react";

// 1. Inisialisasi Context Global Auth
export const AuthContext = createContext();

// 2. Provider Component sebagai Wrapper Aplikasi
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mekanisme Session Restore: Otomatis membaca token saat halaman di-refresh
  useEffect(() => {
    const verifyToken = () => {
      if (token) {
        try {
          // Dekode payload JWT token secara aman di sisi klien
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          
          const decodedData = JSON.parse(jsonPayload);
          
          // Mengeset data pengguna yang login secara dinamis dari token riil
          setUser({
            id: decodedData.id || decodedData.user_id || 1,
            name: decodedData.name || decodedData.username || "Pengguna Apotek",
            email: decodedData.email || "user@apotek.com",
            role: decodedData.role || "user"
          });
        } catch (e) {
          console.error("Token corrupt atau kedaluwarsa, mereset session:", e);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Fungsi Global Login untuk digunakan di Login.jsx milik Silva
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Fungsi Global Logout untuk digunakan di Dashboard.jsx / Navbar.jsx milik Amaya
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login"; // Force redirect bersih untuk meriset total SPA state
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook useAuth() sesuai dengan target mutlak Sprint 13 kalian
export const useAuth = () => {
  return useContext(AuthContext);
};