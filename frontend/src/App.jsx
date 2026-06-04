import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";       
import Register from "./pages/Register"; 
import Dashboard from "./pages/Dashboard"; // 🚀 Import Dashboard Baru
import Footer from "./components/Footer/Footer";

function App() {
  const [cart, setCart] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [view, setView] = useState("katalog"); 
  
  // State user penampung status login
  const [currentUser, setCurrentUser] = useState(null);

  const handleAddToCart = (itemPilihan) => {
    const isExist = cart.find((item) => item.id === itemPilihan.id);
    if (isExist) {
      setCart(
        cart.map((item) =>
          item.id === itemPilihan.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...itemPilihan, quantity: 1 }]);
    }
    alert(`${itemPilihan.title} dimasukkan ke keranjang.`);
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
    setView("checkout");
  };

  const handleExecutePayment = (dataTransaksiLengkap) => {
    console.log("Data siap dikirim ke backend:", dataTransaksiLengkap);
    alert(
      `🚀 Sukses Membuat Pesanan!\n\n` +
      `Nama Penerima: ${dataTransaksiLengkap.nama}\n` +
      `Metode Bayar: ${dataTransaksiLengkap.paymentMethod || "Transfer Bank"}\n` +
      `Total Tagihan: Rp ${dataTransaksiLengkap.total_price.toLocaleString("id-ID")}\n\n` +
      `Data siap ditembak ke API Express.js Kelompok kamu!`
    );

    const sisaDiKeranjang = cart.filter(item => !checkoutItems.some(chosen => chosen.id === item.id));
    setCart(sisaDiKeranjang);
    setCheckoutItems([]);
    setView("katalog");
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "#f8fafc" }}>
      <div>
        {/* 🚀 Mengirim currentUser dan setView ke Navbar */}
        <Navbar cartCount={totalItemsCount} currentView={view} onViewChange={setView} currentUser={currentUser} />

        {view === "katalog" && (
          <Home onAddToCart={handleAddToCart} />
        )}

        {view === "cart" && (
          <Cart 
            cartItems={cart} 
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckoutReady={handleGoToCheckout}
            onViewChange={setView} 
          />
        )}

        {view === "checkout" && (
          <Checkout 
            checkoutItems={checkoutItems}
            onExecutePayment={handleExecutePayment}
            onViewChange={setView}
          />
        )}

        {view === "login" && (
          <Login onLoginSuccess={setCurrentUser} onViewChange={setView} />
        )}

        {view === "register" && (
          <Register onViewChange={setView} />
        )}

        {/* 🚀 LAYAR DASHBOARD USER BARU */}
        {view === "dashboard" && (
          <Dashboard currentUser={currentUser} onUpdateProfile={setCurrentUser} onViewChange={setView} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;