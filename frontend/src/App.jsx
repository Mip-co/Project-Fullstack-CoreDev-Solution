import { Routes, Route, Navigate } from "react-router-dom"; 
import http from "./utils/api/http"; // Instance axios kelompok kalian

// IMPORT INDEPENDENT COMPONENTS & PAGES
import Navbar from "./components/Navbar/Navbar"; 
import Footer from "./components/Footer/Footer"; 

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";
import MedicineDetail from "./pages/MedicineDetail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

// SATPAM GERBANG ADMIN (ROLE-BASED ACCESS CONTROL)
function AdminRoute({ children }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const { token, user } = useAuth();

  // 🔑 LOGIKA BARU: Fungsi tambah ke keranjang belanja langsung menyimpan ke database MySQL
  const handleAddToCart = async (medicine) => {
    if (!user || !user.id) {
      alert("⚠️ Silakan login terlebih dahulu untuk mulai berbelanja!");
      return;
    }

    try {
      const payload = {
        cart_id: user.id, // Menyelaraskan ID keranjang dengan ID pengguna yang login
        medicine_id: medicine.id || medicine.medicine_id,
        quantity: 1
      };

      const response = await http.post("/cart", payload);

      if (response.data.success) {
        alert(`🎉 Sukses! ${medicine.name} berhasil disimpan ke keranjang database MySQL.`);
        // Memaksa window melakukan reload/event trigger ringan agar badge Navbar ikut terupdate otomatis
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("Gagal menyimpan item ke keranjang database:", err);
      alert(err.response?.data?.message || "Gagal menambahkan item ke keranjang database.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#f8fafc", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      
      {/* 🔑 FIX: Navbar tidak memerlukan props cartCount lagi karena sudah menghitung mandiri dari database */}
      {token && <Navbar />}

      <main style={{ flex: 1, paddingBottom: "3rem" }}>
        <Routes>
          {/* PROTECTED ROUTE BERANDA KATALOG */}
          <Route 
            path="/" 
            element = {
              <ProtectedRoute>
                <Home onAddToCart={handleAddToCart} />
              </ProtectedRoute>
            } 
          />
          
          {/* PROTECTED ROUTE DETAIL OBAT */}
          <Route 
            path="/medicines/:id" 
            element = {
              <ProtectedRoute>
                <MedicineDetail onAddToCart={handleAddToCart} />
              </ProtectedRoute>
            } 
          />
          
          {/* PROTECTED ROUTE KERANJANG BELANJA */}
          <Route 
            path="/cart" 
            element = {
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          
          {/* PROTECTED ROUTE FORMULIR CHECKOUT PENGIRIMAN */}
          <Route 
            path="/checkout" 
            element = {
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          
          {/* Gerbang Autentikasi Publik */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* PROTECTED ROUTE DASHBOARD PROFIL & HISTORY */}
          <Route 
            path="/dashboard" 
            element = {
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* PROTECTED ROUTE KHUSUS DASHBOARD MANAJEMEN ADMIN */}
          <Route 
            path="/admin" 
            element = {
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* AUTOMATIC FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* FOOTER KONDISIONAL */}
      {token && <Footer />}
    </div>
  );
}

export default App;