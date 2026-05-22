import { useState } from "react";

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onCheckoutReady, onViewChange }) {
  
  // Hitung total harga keseluruhan dari item di keranjang
  const totalHarga = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalJenisProduk = cartItems.length;

  return (
    <div style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem", fontFamily: "inherit" }}>
      
      {/* Header Utama Layout */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b" }}>Keranjang Belanja</h1>
        <span style={{ backgroundColor: "#bbf7d0", color: "#065f46", padding: "4px 12px", borderRadius: "100px", fontSize: "0.85rem", fontWeight: "bold" }}>
          {totalJenisProduk} Produk
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "4rem", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "1.1rem" }}>Keranjang belanja Anda masih kosong.</p>
          <button 
            type="button"
            onClick={() => onViewChange("katalog")} 
            style={{ backgroundColor: "#0fa968", color: "white", border: "none", padding: "0.75rem 2rem", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
          >
            Kembali Ke Katalog Utama
          </button>
        </div>
      ) : (
        /* Grid Layout: Kiri Tabel List, Kanan Ringkasan Harga */
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: "2.5rem", alignItems: "start" }}>
          
          {/* SISI KIRI: TABEL PRODUK */}
          <div>
            {/* Header Kolom Tabel */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr", padding: "0 0 10px 0", borderBottom: "1px solid #e2e8f0", fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              <span>Produk</span>
              <span style={{ textAlign: "center" }}>Jumlah</span>
              <span style={{ textAlign: "right", paddingRight: "40px" }}>Subtotal</span>
            </div>

            {/* List Row Item Baris */}
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1.5fr", alignItems: "center", padding: "1.5rem 0", borderBottom: "1px solid #f1f5f9" }}>
                
                {/* Info Utama & Gambar */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <img src={item.poster} alt={item.title} style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "12px", backgroundColor: "#f8fafc" }} />
                  <div>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{item.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{item.desc}</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#0fa968", marginTop: "4px" }}>Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                </div>

                {/* Pengatur Kuantitas (Jumlah) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <button 
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, "decrease")}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", cursor: "pointer", fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#0f172a", minWidth: "20px", textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, "increase")}
                    style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", cursor: "pointer", fontSize: "1.1rem", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal & Tombol Tong Sampah */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "24px" }}>
                  <strong style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </strong>
                  <button 
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#94a3b8", transition: "color 0.2s" }}
                    title="Hapus Produk"
                    onMouseEnter={(e) => e.target.style.color = "#ef4444"}
                    onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
                  >
                    🗑️
                  </button>
                </div>

              </div>
            ))}

            {/* Aksi Bawah Tabel */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
              <button 
                type="button"
                onClick={() => onViewChange("katalog")}
                style={{ background: "none", border: "none", color: "#0fa968", fontWeight: "700", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                ← Lanjut Belanja
              </button>
              <button 
                type="button"
                onClick={onClearCart}
                style={{ background: "none", border: "none", color: "#94a3b8", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer" }}
                onMouseEnter={(e) => e.target.style.color = "#ef4444"}
                onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>

          {/* SISI KANAN: CARD RINGKASAN HARGA (STICKY CARD) */}
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", padding: "2rem", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)", position: "sticky", top: "100px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0f172a", marginBottom: "1.5rem" }}>Ringkasan Harga</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.95rem", marginBottom: "0.75rem" }}>
              <span>Total Harga ({cartItems.reduce((s, i) => s + i.quantity, 0)} Barang)</span>
              <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              <span>Diskon</span>
              <span style={{ color: "#ef4444" }}>- Rp 0</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginBottom: "2rem" }}>
              <span>Total Akhir</span>
              <span style={{ color: "#0fa968" }}>Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>

            {/* Tombol Navigasi Menuju Checkout */}
            <button 
              type="button"
              onClick={() => onCheckoutReady(cartItems)}
              style={{ 
                width: "100%", 
                backgroundColor: "#0fa968", 
                color: "#ffffff", 
                border: "none", 
                padding: "1rem", 
                borderRadius: "14px", 
                fontSize: "1.05rem", 
                fontWeight: "700", 
                cursor: "pointer", 
                boxShadow: "0 10px 15px -3px rgba(15, 169, 104, 0.25)", 
                transition: "all 0.2s",
                textAlign: "center"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#0c8c56"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#0fa968"}
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