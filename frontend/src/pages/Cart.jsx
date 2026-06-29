import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../utils/api/http";

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onCheckoutReady }) {
  const navigate = useNavigate();
  const [errorNotice, setErrorNotice] = useState("");

  const token = localStorage.getItem("token");
  const hasToken = !!token;
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const totalHarga = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalJenisProduk = cartItems.length;

  const handleQtyChange = async (item, type) => {
    const currentId = item.medicine_id || item.id;
    const currentQty = item.quantity;
    const newQty = type === "increase" ? currentQty + 1 : currentQty - 1;

    if (newQty < 1) return;

    if (onUpdateQuantity) {
      onUpdateQuantity(currentId, type);
    }

    if (hasToken) {
      const targetCartItemId = item.cart_item_id || item.id;
      try {
        setErrorNotice("");
        await http.put(`/cart/${targetCartItemId}`, { quantity: newQty }, authConfig);
      } catch (err) {
        const rollbackType = type === "increase" ? "decrease" : "increase";
        if (onUpdateQuantity) onUpdateQuantity(currentId, rollbackType);
        setErrorNotice("?? Gagal menyinkronkan kuantitas ke server database. Perubahan dikembalikan.");
      }
    }
  };

  const handleRemoveClick = async (item) => {
    const currentId = item.medicine_id || item.id;

    if (onRemoveItem) {
      onRemoveItem(currentId);
    }

    if (hasToken) {
      const targetCartItemId = item.cart_item_id || item.id;
      try {
        setErrorNotice("");
        await http.delete(`/cart/${targetCartItemId}`, authConfig);
      } catch (err) {
        setErrorNotice("?? Gagal menghapus item dari database server. Harap muat ulang halaman.");
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    if (onCheckoutReady) {
      onCheckoutReady(cartItems);
    }
    navigate("/checkout");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ margin: 0, fontSize: "14px", color: "#10b981", fontWeight: "700" }}>Keranjang</p>
          <h1 style={{ margin: "0.35rem 0 0", fontSize: "2rem", color: "#0f172a" }}>Keranjang Belanja</h1>
        </div>
        <button onClick={() => navigate("/")} style={{ padding: "0.95rem 1.75rem", borderRadius: "14px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", fontWeight: "700", cursor: "pointer" }}>
          Lanjut Belanja
        </button>
      </div>

      {!hasToken && (
        <div style={{ padding: "1rem 1.25rem", backgroundColor: "#fffbeb", color: "#92400e", borderRadius: "16px", border: "1px solid #fde68a", marginBottom: "1.5rem" }}>
          Data keranjang hanya tersimpan sementara. Login untuk menyinkronkan ke server.
        </div>
      )}

      {errorNotice && (
        <div style={{ padding: "1rem 1.25rem", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "16px", border: "1px solid #fecaca", marginBottom: "1.5rem" }}>
          {errorNotice}
        </div>
      )}

      {totalJenisProduk === 0 ? (
        <div style={{ backgroundColor: "#ffffff", padding: "3rem 2rem", border: "1px solid #e2e8f0", borderRadius: "24px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 0.75rem", color: "#0f172a" }}>Keranjang Kosong</h3>
          <p style={{ margin: "0 0 1.5rem", color: "#64748b" }}>Pilih produk terlebih dahulu untuk melanjutkan belanja.</p>
          <button onClick={() => navigate("/")} style={{ padding: "0.95rem 1.75rem", borderRadius: "16px", border: "none", backgroundColor: "#10b981", color: "#ffffff", fontWeight: "700", cursor: "pointer" }}>
            Kembali ke Katalog
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: "1.75rem" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "26px", padding: "1.75rem", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", gap: "1rem" }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#10b981", fontWeight: "700" }}>Daftar Produk</p>
                <h2 style={{ margin: "0.5rem 0 0", color: "#0f172a" }}>Item di Keranjang</h2>
              </div>
              <button onClick={onClearCart} style={{ padding: "0.75rem 1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#0f172a", fontWeight: "700", cursor: "pointer" }}>
                Kosongkan Keranjang
              </button>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              {cartItems.map((item) => (
                <div key={item.id || item.medicine_id} style={{ display: "grid", gridTemplateColumns: "90px 1fr 180px", gap: "1rem", padding: "1rem", borderRadius: "22px", backgroundColor: "#f8fafc", alignItems: "center" }}>
                  <div style={{ width: "90px", height: "90px", borderRadius: "22px", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <span style={{ color: "#10b981", fontSize: "1.5rem", fontWeight: "800" }}>{(item.name || item.title || "Obat")[0]}</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>{item.name || item.title}</p>
                    <p style={{ margin: "0.4rem 0 0", color: "#64748b", fontSize: "13px" }}>{item.description || "Obat Bebas · Per Strip"}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" }}>
                    <p style={{ margin: 0, fontWeight: "700", color: "#10b981" }}>Rp {Number(item.price || 0).toLocaleString("id-ID")}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "0.4rem 0.55rem" }}>
                      <button onClick={() => handleQtyChange(item, "decrease")} disabled={item.quantity <= 1} style={{ width: "34px", height: "34px", borderRadius: "12px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", cursor: "pointer" }}>-</button>
                      <span style={{ minWidth: "28px", textAlign: "center", fontWeight: "700" }}>{item.quantity}</span>
                      <button onClick={() => handleQtyChange(item, "increase")} style={{ width: "34px", height: "34px", borderRadius: "12px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", cursor: "pointer" }}>+</button>
                    </div>
                    <button onClick={() => handleRemoveClick(item)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside style={{ backgroundColor: "#ffffff", borderRadius: "26px", padding: "1.75rem", border: "1px solid #e2e8f0", position: "sticky", top: "1rem", height: "fit-content" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#10b981", fontWeight: "700" }}>Ringkasan Harga</p>
              <h2 style={{ margin: "0.5rem 0 0", color: "#0f172a" }}>Total {totalQty} Barang</h2>
            </div>

            <div style={{ display: "grid", gap: "0.9rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>Total Harga</span>
                <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>Diskon</span>
                <span>- Rp 0</span>
              </div>
              <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "1rem", display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#0f172a", fontSize: "18px" }}>
                <span>Total Akhir</span>
                <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button onClick={handleProceedToCheckout} style={{ width: "100%", padding: "1rem", borderRadius: "18px", border: "none", backgroundColor: "#10b981", color: "#ffffff", fontWeight: "700", cursor: "pointer", fontSize: "16px" }}>
              Lanjut Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
