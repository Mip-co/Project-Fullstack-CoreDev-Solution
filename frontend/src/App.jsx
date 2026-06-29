import { useState } from "react"; 
import { Routes, Route, Navigate } from "react-router-dom"; 

// IMPORT INDEPENDENT COMPONENTS & PAGES
import Navbar from "./components/Navbar/Navbar"; 
import Footer from "./components/Footer/Footer"; 

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";

// SINKRONISASI ADIT: Mengimpor berkas halaman spesifikasi detail produk obat
import MedicineDetail from "./pages/MedicineDetail";

// 🔑 IMPORT SATPAM GERBANG PROTECTED ROUTE YANG BARU SAJA KAMU TARUH DI FOLDERNYA
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  // MAINTAIN GLOBAL STATES & FLOW LOCAL CART BELANJAAN
  const [cart, setCart] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);

  // 🗑️ PEMBERSIHAN TOTAL: State manual isAuth, currentUser, useEffect, dan handleLogout 
  // sudah dihapus sepenuhnya karena tugasnya sudah resmi digantikan oleh AuthContext!

  // Fungsi tambah ke keranjang belanjaan (Sinkron Skema Database MySQL)
  const handleAddToCart = (itemPilihan) => {
    const targetId = itemPilihan.medicine_id || itemPilihan.id;
    const isExist = cart.find((item) => (item.medicine_id || item.id) === targetId);
    
    if (isExist) {
      setCart(
        cart.map((item) =>
          (item.medicine_id || item.id) === targetId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...itemPilihan, id: targetId, quantity: 1 }]);
    }
    alert(`${itemPilihan.name || itemPilihan.title} dimasukkan ke keranjang.`);
  };

  const handleUpdateQuantity = (id, type) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQty = type === "increase" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleGoToCheckout = (barangTerpilih) => {
    setCheckoutItems(barangTerpilih);
  };

  // HANDLER PEMBERSIHAN DATA KERANJANG PASCA CHECKOUT SUKSES
  const handleExecutePayment = (dataTransaksiLengkap) => {
    console.log("Data sukses dikirim ke backend database:", dataTransaksiLengkap);
    
    alert(
      `🚀 Sukses Membuat Pesanan Riil!\n\n` +
      `Nama Penerima: ${dataTransaksiLengkap.nama}\n` +
      `Total Pembayaran: Rp ${dataTransaksiLengkap.total_price.toLocaleString("id-ID")}\n\n` +
      `Data terekam aman di tabel MySQL orders & order_items kelompok!`
    );

    // Filter potong menghapus item yang lolos proses checkout secara aman
    const sisaDiKeranjang = cart.filter(
      item => !checkoutItems.some(chosen => (chosen.medicine_id || chosen.id) === (item.medicine_id || item.id))
    );
    
    setCart(sisaDiKeranjang); 
    // PENTING: Jangan langsung kosongkan checkoutItems di sini agar komponen Checkout tidak crash saat proses unmount navigasi
    setTimeout(() => {
      setCheckoutItems([]);
    }, 500);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#f8fafc", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      
      {/* 🗑️ BERSIH DARI PROP DRILLING: Navbar tidak lagi dititipi props currentUser secara manual */}
      <Navbar cartCount={totalItemsCount} />

      <main style={{ flex: 1, paddingBottom: "3rem" }}>
        <Routes>
          {/* PROTECTED ROUTE BERANDA KATALOG */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home onAddToCart={handleAddToCart} />
              </ProtectedRoute>
            } 
          />
          
          {/* PROTECTED ROUTE DETAIL OBAT */}
          <Route 
            path="/medicines/:id" 
            element={
              <ProtectedRoute>
                <MedicineDetail onAddToCart={handleAddToCart} />
              </ProtectedRoute>
            } 
          />
          
          {/* PROTECTED ROUTE KERANJANG BELANJA */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "2rem" }}>
                  <Cart 
                    cartItems={cart} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    onCheckoutReady={handleGoToCheckout}
                  />
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* PROTECTED ROUTE FORMULIR CHECKOUT PENGIRIMAN */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                  <Checkout checkoutItems={checkoutItems} onExecutePayment={handleExecutePayment} />
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Gerbang Autentikasi Publik (Silva) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* PROTECTED ROUTE DASHBOARD PROFIL & HISTORY (Amaya) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;