import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 🔑 FIX: Keluar 2 tingkat (dari folder ProtectedRoute -> components -> src)

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#64748b" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>⏳ Menyinkronkan Sesi Keamanan...</h2>
          <p style={{ margin: 0, fontSize: "14px" }}>Mohon tunggu, sedang memverifikasi token enkripsi gerbang masuk SPA.</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;