import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔑 SPRINT 11: Import Navigate untuk Checkout

function Checkout({ checkoutItems, onExecutePayment }) {
  const navigate = useNavigate(); // 🔑 Pemicu perpindahan URL halaman resmi
  const [shippingData, setShippingData] = useState({
    nama: "",
    telepon: "",
    alamat: ""
  });

  // State untuk kurir pengiriman (Default: Ekspres)
  const [shippingMethod, setShippingMethod] = useState("Ekspres");

  // Biaya kirim dinamis mengikuti pilihan
  const biayaPengiriman = shippingMethod === "Ekspres" ? 15000 : 5000;

  const totalHargaBarang = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAkhirTagihan = totalHargaBarang + biayaPengiriman;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!shippingData.nama || !shippingData.telepon || !shippingData.alamat) {
      alert("Harap lengkapi Alamat Pengiriman terlebih dahulu!");
      return;
    }
    
    // 1. Eksekusi pemindahan data & pembersihan keranjang belanja ke App.jsx
    if (onExecutePayment) {
      onExecutePayment({
        ...shippingData,
        shippingMethod,
        items: checkoutItems,
        total_price: totalAkhirTagihan
      });
    }

    // 2. 🔑 FIX TOMBOL BAYAR: Pindahkan rute URL browser ke katalog utama setelah sukses transaksi!
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem", fontFamily: "inherit" }}>
      
      {/* 🔑 FIX TOMBOL KEMBALI: Menggunakan navigate() formal React Router DOM */}
      <button 
        type="button"
        onClick={() => navigate("/cart")} 
        style={{ border: "none", background: "none", color: "#0fa968", fontWeight: "700", cursor: "pointer", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "5px", fontSize: "1rem" }}
      >
        ← Kembali ke Keranjang
      </button>

      <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b", marginBottom: "2.5rem" }}>Checkout Pesanan</h1>

      <form onSubmit={handleSubmitOrder} style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: "3rem", alignItems: "start" }}>
        
        {/* KOLOM KIRI: FORM DATA ALAMAT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* 📍 ALAMAT PENGIRIMAN */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", padding: "2rem", borderRadius: "20px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a", marginBottom: "1.25rem" }}>📍 Alamat Pengiriman</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <input 
                  type="text" 
                  name="nama"
                  value={shippingData.nama}
                  onChange={handleInputChange}
                  placeholder="Nama Penerima" 
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }}
                  required
                />
              </div>
              <div>
                <textarea 
                  name="alamat"
                  value={shippingData.alamat}
                  onChange={handleInputChange}
                  placeholder="Alamat Lengkap (Nama Jalan, No. Rumah, Kelurahan)" 
                  rows="3"
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none", resize: "none", fontFamily: "inherit" }}
                  required
                ></textarea>
              </div>
              <div>
                <input 
                  type="tel" 
                  name="telepon"
                  value={shippingData.telepon}
                  onChange={handleInputChange}
                  placeholder="Nomor Telepon (WhatsApp)" 
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }}
                  required
                />
              </div>
            </div>
          </div>

          {/* 🚚 METODE PENGIRIMAN */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", padding: "2rem", borderRadius: "20px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a", marginBottom: "1.25rem" }}>🚚 Metode Pengiriman</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              
              <label style={{ border: shippingMethod === "Ekspres" ? "2px solid #0fa968" : "1px solid #e2e8f0", backgroundColor: shippingMethod === "Ekspres" ? "#edfaf4" : "#ffffff", padding: "1.25rem", borderRadius: "16px", display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", transition: "all 0.2s" }}>
                <input type="radio" name="shippingMethod" checked={shippingMethod === "Ekspres"} onChange={() => setShippingMethod("Ekspres")} style={{ accentColor: "#0fa968", marginTop: "4px" }} />
                <div>
                  <strong style={{ display: "block", fontSize: "1.05rem", color: "#0fa968" }}>Ekspres (1 Jam)</strong>
                  <span style={{ display: "block", fontSize: "0.85rem", color: "#64748b", margin: "4px 0" }}>Kurir Klinik Instan</span>
                  <strong style={{ fontSize: "1rem", color: "#1e293b" }}>Rp 15.000</strong>
                </div>
              </label>

              <label style={{ border: shippingMethod === "Reguler" ? "2px solid #0fa968" : "1px solid #e2e8f0", backgroundColor: shippingMethod === "Reguler" ? "#edfaf4" : "#ffffff", padding: "1.25rem", borderRadius: "16px", display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", transition: "all 0.2s" }}>
                <input type="radio" name="shippingMethod" checked={shippingMethod === "Reguler"} onChange={() => setShippingMethod("Reguler")} style={{ accentColor: "#0fa968", marginTop: "4px" }} />
                <div>
                  <strong style={{ display: "block", fontSize: "1.05rem", color: "#0fa968" }}>Reguler (Sore Sampai)</strong>
                  <span style={{ display: "block", fontSize: "0.85rem", color: "#64748b", margin: "4px 0" }}>Kurir Standar</span>
                  <strong style={{ fontSize: "1rem", color: "#1e293b" }}>Rp 5.000</strong>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* KOLOM KANAN: CARD RINGKASAN PESANAN (STICKY) */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)", position: "sticky", top: "100px" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", marginBottom: "1.5rem" }}>Ringkasan Pesanan</h3>
          
          {/* Daftar Singkat Item */}
          <div style={{ marginBottom: "1.5rem", maxHeight: "180px", overflowY: "auto" }}>
            {checkoutItems.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                {/* 🔑 FIX PROPERTI MYSQL: Mengubah item.poster & item.title menjadi data MySQL riil */}
                <img 
                  src={`http://localhost:3000/uploads/${item.image}`} 
                  alt={item.name} 
                  style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=Obat'; }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>{item.name}</h4>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.quantity} Qty</span>
                </div>
                <strong style={{ fontSize: "0.95rem", color: "#1e293b" }}>
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </strong>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.95rem", marginBottom: "0.75rem" }}>
            <span>Subtotal</span>
            <span>Rp {totalHargaBarang.toLocaleString("id-ID")}</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            <span>Biaya Pengiriman</span>
            <span>Rp {biayaPengiriman.toLocaleString("id-ID")}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
            <span>Total Bayar</span>
            <span style={{ color: "#0fa968" }}>Rp {totalAkhirTagihan.toLocaleString("id-ID")}</span>
          </div>

          <button 
            type="submit"
            style={{ width: "100%", backgroundColor: "#0fa968", color: "#ffffff", border: "none", padding: "1rem", borderRadius: "14px", fontSize: "1.05rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(15, 169, 104, 0.25)", transition: "all 0.2s" }}
          >
            Konfirmasi & Bayar
          </button>
          
          <p style={{ fontStyle: "italic", fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", marginTop: "12px" }}>
            *Pesanan obat keras wajib menunjukkan resep asli saat kurir sampai.
          </p>
        </div>

      </form>
    </div>
  );
}

export default Checkout;