import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import http from "../../utils/api/http";

function Navbar() {
  const { token, user } = useAuth();
  const location = useLocation();

  const [navPreviewUrl, setNavPreviewUrl] = useState("");
  // State lokal untuk menampung jumlah total item belanja di database MySQL
  const [dbCartCount, setDbCartCount] = useState(0);

  // 🔄 FETCH DATA: Sinkronisasi Foto Profil dan Hitung Jumlah Barang dari Database
  const fetchNavbarData = async () => {
    if (!token || !user || !user.id) {
      setNavPreviewUrl("");
      setDbCartCount(0);
      return;
    }
    
    try {
      // A. Tarik Data User untuk Foto Profil
      const userResponse = await http.get(`/users/${user.id}`);
      const dbUser = userResponse.data?.data || userResponse.data?.user || userResponse.data;
      
      if (dbUser && (dbUser.profile_picture || dbUser.photo)) {
        setNavPreviewUrl(`http://localhost:3000/uploads/${dbUser.profile_picture || dbUser.photo}`);
      } else {
        setNavPreviewUrl("");
      }

      // B. Tarik Data Keranjang riil milik User ID yang sedang login
      const cartResponse = await http.get(`/cart/user/${user.id}`);
      const cartItems = cartResponse.data?.data || cartResponse.data || [];
      
      // Jumlahkan total kuantitas barang belanjaan yang ada di database
      const totalQty = cartItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0);
      setDbCartCount(totalQty);

    } catch (err) {
      console.error("Navbar gagal melakukan sinkronisasi data database:", err);
      if (user && user.profile_picture) {
        setNavPreviewUrl(`http://localhost:3000/uploads/${user.profile_picture}`);
      }
    }
  };

  // 🔑 AUTOMATION ZONE: Menjaga sinkronisasi data secara otomatis dan reaktif
  useEffect(() => {
    // Jalankan penarikan data standar saat ganti halaman atau login
    fetchNavbarData();

    // Listener jitu untuk mendengarkan peluit Event "storage" dari App.jsx saat tombol Beli ditekan
    const handleCartUpdateSignal = () => {
      console.log("Sinyal klik beli ditangkap! Memperbarui badge...");
      fetchNavbarData();
    };

    window.addEventListener("storage", handleCartUpdateSignal);

    // Pembersihan listener saat komponen unmount agar performa tetap enteng
    return () => {
      window.removeEventListener("storage", handleCartUpdateSignal);
    };
  }, [token, user, location.pathname]); 

  return (
    <nav style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "1rem 2rem", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0fa968", cursor: "pointer", textDecoration: "none" }}>
          ApotekNow
        </Link>

        {/* Menu & Tombol Aksi */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          
          {/* Menu Katalog */}
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
          
          {/* Tombol Keranjang */}
          <Link 
            to="/cart" 
            style={{ position: "relative", cursor: "pointer", fontSize: "1.2rem", textDecoration: "none" }}
          >
            🛒
            {/* FIX BADGE REAKTIF: Angka render langsung berubah mengikuti isi tabel cart_items */}
            {dbCartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-10px", backgroundColor: "#ef4444", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem", fontWeight: "700" }}>
                {dbCartCount}
              </span>
            )}
          </Link>

          {/* PROFILE AVATAR BERDASARKAN TOKEN */}
          {token && user ? (
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
                textDecoration: "none",
                overflow: "hidden" 
              }}
              title="Buka Dashboard Akun"
            >
              {navPreviewUrl ? (
                <img 
                  src={navPreviewUrl} 
                  alt="Nav Avatar" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : "U"
              )}
            </Link>
          ) : (
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