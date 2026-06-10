import React from "react";
import { Link, useLocation } from "react-router-dom"; // 🔑 ISI SPRINT 11: Menggunakan Link & useLocation

function Navbar({ cartCount, currentUser }) {
  // Trik opsional biar link menu otomatis berwarna hijau aktif sesuai URL browser saat ini
  const location = useLocation();

  return (
    <nav style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Brand Logo (Sudah Sinkron Router 🚀) */}
        <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0fa968", cursor: "pointer", textDecoration: "none" }}>
          ApotekApp
        </Link>

        {/* Menu & Tombol Aksi */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          
          {/* Menu Katalog (Sudah Sinkron Router 🚀) */}
          <Link 
            to="/" 
            style={{ 
              fontWeight: "600", 
              color: location.pathname === "/" ? "#0fa968" : "#475569", 
              cursor: "pointer",
              textDecoration: "none"
            }}
          >
            Katalog
          </Link>
          
          {/* Tombol Keranjang (Sudah Sinkron Router 🚀) */}
          <Link 
            to="/cart" 
            style={{ position: "relative", cursor: "pointer", fontSize: "1.2rem", textDecoration: "none" }}
          >
            🛒
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-10px", backgroundColor: "#ef4444", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem", fontWeight: "700" }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* 🔄 KONDISIONAL TOMBOL LOGIN / PROFILE AVATAR */}
          {currentUser ? (
            /* Avatar Profile Dashboard (Sudah Sinkron Router 🚀) */
            <Link 
              to="/dashboard"
              style={{ 
                width: "38px", 
                height: "38px", 
                borderRadius: "50%", 
                backgroundColor: "#0fa968", 
                color: "#ffffff", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontWeight: "700", 
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(15, 169, 104, 0.2)",
                fontSize: "0.95rem",
                textDecoration: "none"
              }}
              title="Buka Dashboard Akun"
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </Link>
          ) : (
            /* Tombol Login (Sudah Sinkron Router 🚀) */
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button 
                type="button"
                style={{ backgroundColor: "#0fa968", color: "#ffffff", border: "none", padding: "0.6rem 1.5rem", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
              >
                Login
              </button>
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;