import React from "react";

function Navbar({ cartCount, currentView, onViewChange, currentUser }) {
  return (
    <nav style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Brand Logo */}
        <div onClick={() => onViewChange("katalog")} style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0fa968", cursor: "pointer" }}>
          ApotekApp<span style={{ color: "#0f172a" }}></span>
        </div>

        {/* Menu & Tombol Aksi */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <span onClick={() => onViewChange("katalog")} style={{ fontWeight: "600", color: currentView === "katalog" ? "#0fa968" : "#475569", cursor: "pointer" }}>
            Katalog
          </span>
          
          {/* Tombol Keranjang */}
          <div onClick={() => onViewChange("cart")} style={{ position: "relative", cursor: "pointer", fontSize: "1.2rem" }}>
            🛒
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-10px", backgroundColor: "#ef4444", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem", fontWeight: "700" }}>
                {cartCount}
              </span>
            )}
          </div>

          {/* 🔄 KONDISIONAL TOMBOL LOGIN / PROFILE AVATAR */}
          {currentUser ? (
            <div 
              onClick={() => onViewChange("dashboard")}
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
                fontSize: "0.95rem"
              }}
              title="Buka Dashboard Akun"
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => onViewChange("login")}
              style={{ backgroundColor: "#0fa968", color: "#ffffff", border: "none", padding: "0.6rem 1.5rem", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
            >
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;