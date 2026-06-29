import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import http from "../utils/api/http"; 
import { useAuth } from "../context/AuthContext"; 

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Ambil data isi keranjang riil langsung dari database MySQL via API backend
  const fetchCartFromDatabase = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await http.get(`/cart/user/${user.id}`);
      const items = res.data?.data || res.data || [];
      setCartItems(items);
    } catch (err) {
      console.error("Gagal memuat data keranjang dari database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartFromDatabase();
  }, [user]);

  // 🔄 Handler Kuantitas Baru: Halus, Instan, & Anti Kedip-Kedip!
  const handleUpdateQuantity = async (cartItemId, currentQty, action) => {
    const newQty = action === "plus" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) return; // Mencegah kuantitas minus

    // 🔑 LANGKAH 1: Update state lokal secara instant (Optimistic Update)
    // Ini yang bikin angka langsung berubah mulus tanpa nunggu loading screen!
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      )
    );

    // 🔑 LANGKAH 2: Biarkan backend mengupdate MySQL di latar belakang
    try {
      await http.put(`/cart/${cartItemId}`, { quantity: newQty });
      
      // Kirim peluit event storage agar badge Navbar ikut terupdate secara real-time
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Gagal memperbarui jumlah item di database:", err);
      alert("Gagal memperbarui data di server, mengembalikan jumlah semula...");
      
      // Rollback jika server mati/gagal koneksi, kembalikan ke data DB asli
      fetchCartFromDatabase();
    }
  };

  // 🗑️ Handler untuk hapus item dari keranjang database
  const handleDeleteItem = async (cartItemId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus obat ini dari keranjang?")) {
      try {
        await http.delete(`/cart/${cartItemId}`);
        alert("🗑️ Item berhasil dihapus dari keranjang database.");
        fetchCartFromDatabase(); // Refresh data database
      } catch (err) {
        console.error("Gagal menghapus item keranjang:", err);
      }
    }
  };

  // 🧮 Kalkulasi Total Harga Secara Dinamis berdasarkan DB state
  const totalHarga = cartItems.reduce((acc, item) => {
    return acc + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", fontFamily: "sans-serif" }}>
        <h3>🔄 Sedang menarik data keranjang belanja asli dari database...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "700" }}>Keranjang</span>
      <h1 style={{ margin: "0 0 2rem 0", fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed #cbd5e1", borderRadius: "16px", backgroundColor: "#fff" }}>
          <span style={{ fontSize: "48px" }}>🛒</span>
          <h3 style={{ color: "#475569", margin: "1rem 0" }}>Keranjang belanjamu masih kosong, nih.</h3>
          <button onClick={() => navigate("/")} style={{ padding: "0.6rem 1.5rem", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
            Mulai Belanja Obat
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          
          {/* SISI KIRI: LIST ITEM KERANJANG BELANJA */}
          <div style={{ flex: "2 1 600px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "16px", fontWeight: "700" }}>Item di Keranjang</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "12px", gap: "1rem", border: "1px solid #f1f5f9" }}>
                  
                  <img 
                    src={`http://localhost:3000/uploads/${item.image}`} 
                    alt={item.name} 
                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", backgroundColor: "#fff" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Obat"; }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>{item.name}</h4>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "12px", color: "#64748b", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</p>
                    <span style={{ display: "block", marginTop: "0.5rem", fontSize: "14px", fontWeight: "800", color: "#10b981" }}>
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.25rem" }}>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity, "minus")} style={{ width: "28px", height: "28px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontWeight: "700" }}>-</button>
                      <span style={{ minWidth: "20px", textAlign: "center", fontSize: "14px", fontWeight: "700" }}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity, "plus")} style={{ width: "28px", height: "28px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontWeight: "700" }}>+</button>
                    </div>
                    
                    <button onClick={() => handleDeleteItem(item.id)} style={{ backgroundColor: "transparent", border: "none", color: "#ef4444", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SISI KANAN: RINGKASAN HARGA & INTEGRASI NAVIGASI */}
          <div style={{ flex: "1 1 350px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.5rem", height: "fit-content" }}>
            <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700", textTransform: "uppercase" }}>Ringkasan Harga</span>
            <h2 style={{ margin: "0.25rem 0 1.5rem 0", fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>Total {cartItems.length} Barang</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "14px", color: "#475569" }}>
              <span>Total Harga</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "14px", color: "#475569", borderBottom: "1px dashed #e2e8f0", paddingBottom: "1rem" }}>
              <span>Diskon</span>
              <span>- Rp 0</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Total Akhir</span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>

            {/* 🔑 FIX POSISI: Berada di bawah Total Akhir, melempar data state keranjang asli ke Checkout */}
            <button 
              onClick={() => navigate("/checkout", { state: { incomingCartItems: cartItems } })}
              style={{ width: "100%", padding: "0.85rem", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
            >
              Lanjut Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;