import { useState } from "react";
import { Routes, Route } from "react-router-dom"; 

// 🔑 IMPORT LANGSUNG KOMPONEN INDEPENDEN:
import Navbar from "./components/Navbar/Navbar"; 
import Footer from "./components/Footer/Footer"; 

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";

function App() {
  const [cart, setCart] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fungsi tambah ke keranjang belanjaan (Sudah Sinkron MySQL 🚀)
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

  // Fungsi eksekusi pembayaran asli kelompokmu
  const handleExecutePayment = (dataTransaksiLengkap) => {
    console.log("Data siap dikirim ke backend:", dataTransaksiLengkap);
    
    // 1. ALERT NOTA BERHASIL DIKIRIM 🚀
    alert(
      `🚀 Sukses Membuat Pesanan!\n\n` +
      `Nama Penerima: ${dataTransaksiLengkap.nama}\n` +
      `Metode Bayar: ${dataTransaksiLengkap.shippingMethod || "Ekspres"}\n` +
      `Total Tagihan: Rp ${dataTransaksiLengkap.total_price.toLocaleString("id-ID")}\n\n` +
      `Data siap ditembak ke API Express.js Kelompok kamu!`
    );

    // 2. FIX KERANJANG KOSONG: Menghapus barang yang sudah dicheckout dari keranjang belanja
    const sisaDiKeranjang = cart.filter(item => !checkoutItems.some(chosen => (chosen.medicine_id || chosen.id) === (item.medicine_id || item.id)));
    setCart(sisaDiKeranjang);
    setCheckoutItems([]);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // 🔑 KUNCI FIX FONT: Kita kunci font global di div utama agar semuanya kembali modern tanpa kaki!
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between", 
      backgroundColor: "#f8fafc",
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" // 👈 SUNTIKAN SAKTI DI SINI!
    }}>
      
      {/* Fixed Navbar Global */}
      <Navbar cartCount={totalItemsCount} currentUser={currentUser} />

      <main style={{ flex: 1, paddingBottom: "3rem" }}>
        <Routes>
          {/* Beranda Katalog */}
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          
          {/* Halaman Keranjang */}
          <Route path="/cart" element={
            <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "2rem" }}>
              <Cart 
                cartItems={cart} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onCheckoutReady={handleGoToCheckout}
              />
            </div>
          } />
          
          {/* Halaman Transaksi */}
          <Route path="/checkout" element={
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
              <Checkout checkoutItems={checkoutItems} onExecutePayment={handleExecutePayment} />
            </div>
          } />
          
          {/* Jalur URL Autentikasi User & Dashboard */}
          <Route path="/login" element={<Login onLoginSuccess={setCurrentUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} onUpdateProfile={setCurrentUser} />} />
        </Routes>
      </main>

      {/* Footer otomatis di paling bawah */}
      <Footer />
    </div>
  );
}

export default App;