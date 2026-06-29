import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import http from "../utils/api/http"; // Instance axios kelompok kalian
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Ambil kiriman data keranjang dari state navigasi Cart.jsx
  const cartItems = location.state?.incomingCartItems || [];

  // Form State Pengiriman Alamat Lengkap Pembeli
  const [shippingForm, setShippingForm] = useState({
    receiverName: user?.name || "",
    address: user?.address || "",
    phone: user?.phone || "",
    notes: ""
  });

  // Master Pilihan Opsi Kurir
  const courierOptions = [
    { id: "instant", name: "🚚 Kurir Instan ApotekNow", desc: "Tiba dalam 1-2 Jam (Sangat Direkomendasikan)", fee: 25000 },
    { id: "regular", name: "📦 Kurir Reguler Ekspedisi", desc: "Tiba Besok Hari (Reguler)", fee: 10000 }
  ];
  const [selectedCourier, setSelectedCourier] = useState(courierOptions[0]);

  const [submitting, setSubmitting] = useState(false);

  // Hitung Kalkulasi Harga Belanjaan Dinamis
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
  const totalPayment = subtotal + selectedCourier.fee;

  // 🔄 Handler klik buat order untuk dikirim permanen ke MySQL
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("⚠️ Tidak ada item obat yang bisa dicheckout.");
      return;
    }

    if (!shippingForm.address || !shippingForm.phone || !shippingForm.receiverName) {
      alert("⚠️ Mohon lengkapi seluruh informasi data pengiriman!");
      return;
    }

    setSubmitting(true);
    try {
      // 🔑 SINKRONISASI PAYLOAD: Menggunakan properti bahasa Indonesia sesuai req.body di CheckoutController.js
      const orderPayload = {
        nama: shippingForm.receiverName,   
        telepon: shippingForm.phone,       
        alamat: shippingForm.address,       
        catatan: shippingForm.notes,       
        shippingMethod: selectedCourier.id, 
        total_price: totalPayment,
        items: cartItems.map(item => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await http.post("/checkout", orderPayload);

      if (response.data.success) {
        // 🔑 SAKTI: Bersihkan isi keranjang database (cart_items) milik user ini pasca checkout sukses
        try {
          // Menembak endpoint delete cart berdasarkan user_id agar tabel bersih
          await http.delete(`/cart/user/${user.id}`); 
        } catch (cartErr) {
          console.log("Menggunakan metode hapus individual...");
          // Fallback jika backend kalian belum menyediakan route massal per user_id
          await Promise.all(
            cartItems.map(item => http.delete(`/cart/${item.id}`))
          );
        }

        alert(
          `🚀 Sukses Membuat Pesanan Riil!\n\n` +
          `Nama Penerima: ${shippingForm.receiverName}\n` +
          `Kurir Pilihan: ${selectedCourier.name}\n` +
          `Total Pembayaran: Rp ${totalPayment.toLocaleString("id-ID")}\n\n` +
          `Data terekam aman & keranjang belanjaan dibersihkan dari MySQL!`
        );
        
        // Meniup peluit event storage agar angka badge merah di Navbar langsung reset ke 0 secara real-time!
        window.dispatchEvent(new Event("storage"));
        
        // Redirect pembeli kembali ke halaman dashboard riwayat transaksi mereka
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Gagal melakukan proses transaksi checkout:", err);
      alert(err.response?.data?.message || "Gagal membuat pesanan ke database server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "700" }}>Checkout Pesanan</span>
      <h1 style={{ margin: "0 0 2rem 0", fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>Lengkapi Data Pengiriman</h1>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        
        {/* SISI KIRI: FORM DATA PENERIMA & PILIHAN KURIR */}
        <div style={{ flex: "2 1 600px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Box Formulir Alamat */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2rem" }}>
            <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Lengkapi informasi penerima</h3>
            
            <form onSubmit={handlePlaceOrder}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Nama Penerima</label>
                <input type="text" value={shippingForm.receiverName} onChange={(e) => setShippingForm({ ...shippingForm, receiverName: e.target.value })} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} required />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Alamat Lengkap</label>
                <textarea value={shippingForm.address} onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })} placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", minHeight: "100px", boxSizing: "border-box", fontFamily: "sans-serif" }} required />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Nomor Telepon (WhatsApp)</label>
                <input type="text" value={shippingForm.phone} onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Catatan Tambahan (Opsional)</label>
                <input type="text" value={shippingForm.notes} onChange={(e) => setShippingForm({ ...shippingForm, notes: e.target.value })} placeholder="Titipkan ke satpam / pagar warna hitam" style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>
            </form>
          </div>

          {/* PILIHAN METODE PENGIRIMAN KURIR */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2rem" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Pilih Metode Pengiriman</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {courierOptions.map((option) => {
                const isSelected = selectedCourier.id === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedCourier(option)}
                    style={{
                      padding: "1rem",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #10b981" : "1px solid #e2e8f0",
                      backgroundColor: isSelected ? "#f0fdf4" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{option.name}</p>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{option.desc}</span>
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: "800", color: "#10b981" }}>
                      Rp {option.fee.toLocaleString("id-ID")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* SISI KANAN: DETAIL RINGKASAN BELANJA OBAT */}
        <div style={{ flex: "1 1 350px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.5rem", height: "fit-content" }}>
          <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700", textTransform: "uppercase" }}>Ringkasan Pesanan</span>
          <h2 style={{ margin: "0.25rem 0 1.5rem 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Detail Pesanan</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "#f8fafc", padding: "0.75rem", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                <img 
                  src={`http://localhost:3000/uploads/${item.image}`} 
                  alt={item.name} 
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", backgroundColor: "#fff" }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=Obat"; }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{item.name}</h4>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{item.quantity} x</span>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#10b981" }}>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "13px", color: "#475569" }}>
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "13px", color: "#475569" }}>
            <span>Biaya Pengiriman ({selectedCourier.id === "instant" ? "Instan" : "Reguler"})</span>
            <span>Rp {selectedCourier.fee.toLocaleString("id-ID")}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderTop: "1px dashed #e2e8f0", paddingTop: "0.75rem" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Total Bayar</span>
            <span style={{ fontSize: "16px", fontWeight: "850", color: "#0f172a" }}>Rp {totalPayment.toLocaleString("id-ID")}</span>
          </div>
          <p style={{ margin: "0 0 1.5rem 0", fontSize: "11px", color: "#64748b", fontStyle: "italic" }}>*Pesanan obat keras wajib menunjukkan resep asli saat kurir sampai.</p>

          <button 
            onClick={handlePlaceOrder}
            disabled={submitting || cartItems.length === 0}
            style={{ 
              width: "100%", 
              padding: "0.85rem", 
              backgroundColor: submitting || cartItems.length === 0 ? "#cbd5e1" : "#10b981", 
              color: "#fff", 
              border: "none", 
              borderRadius: "10px", 
              fontSize: "14px", 
              fontWeight: "700", 
              cursor: submitting || cartItems.length === 0 ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {submitting ? "Memproses..." : "Buat Pesanan Sekarang"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Checkout;