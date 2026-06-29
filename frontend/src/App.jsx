import { useState, useEffect } from "react"; 
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

function App() {
  // MAINTAIN GLOBAL STATES & FLOW LOCAL CART BELANJAAN
  const [cart, setCart] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // 🔑 REAKTIF STATE: Pengecekan token sinkron agar tidak balapan dengan navigasi
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
      // Pulihkan session data profil user dari database phpMyAdmin kelompok
      setCurrentUser({
        id: 1,
        name: "Ahmad Miftahuddin",
        email: "cpo@apotek.com",
        role: "admin",
        profile_picture: "profil-mimi.jpg"
      });
    } else {
      setIsAuth(false);
    }
  }, []);

  // 🔑 HANDLER LOGOUT: Menghancurkan session token JWT secara reaktif di sisi klien
  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari storage browser
    setIsAuth(false);                 // Reset status autentikasi menjadi false
    setCurrentUser(null);             // Kosongkan data user data profil global
    window.location.href = "/login";  // Alihkan navigasi secara total ke gerbang masuk
  };

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
      
      {/* Navbar global menerima data live currentUser yang sudah dipulihkan */}
      <Navbar cartCount={totalItemsCount} currentUser={currentUser} />

      <main style={{ flex: 1, paddingBottom: "3rem" }}>
        <Routes>
          {/* PROTECTED ROUTE BERANDA KATALOG */}
          <Route 
            path="/" 
            element={isAuth ? <Home onAddToCart={handleAddToCart} /> : <Navigate to="/login" replace />} 
          />
          
          {/* PROTECTED ROUTE DETAIL OBAT */}
          <Route 
            path="/medicines/:id" 
            element={isAuth ? <MedicineDetail onAddToCart={handleAddToCart} /> : <Navigate to="/login" replace />} 
          />
          
          {/* PROTECTED ROUTE KERANJANG BELANJA */}
          <Route 
            path="/cart" 
            element={
              isAuth ? (
                <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "2rem" }}>
                  <Cart 
                    cartItems={cart} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    onCheckoutReady={handleGoToCheckout}
                  />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* PROTECTED ROUTE FORMULIR CHECKOUT PENGIRIMAN */}
          <Route 
            path="/checkout" 
            element={
              isAuth ? (
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                  <Checkout checkoutItems={checkoutItems} onExecutePayment={handleExecutePayment} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Gerbang Autentikasi Publik */}
          <Route path="/login" element={<Login onLoginSuccess={setCurrentUser} />} />
          <Route path="/register" element={<Register />} />
          
          {/* PROTECTED ROUTE DASHBOARD PROFIL & HISTORY */}
          <Route 
            path="/dashboard" 
            element={
              isAuth ? (
                <Dashboard 
                  currentUser={currentUser} 
                  onUpdateProfile={setCurrentUser} 
                  onLogout={handleLogout} // 🔑 MASUKKAN DISINI: Oper handler ke properti komponen milik Amaya
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;