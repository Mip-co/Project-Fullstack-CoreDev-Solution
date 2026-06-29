import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../utils/api/http";

function Checkout({ checkoutItems, onExecutePayment }) {
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [shippingMethod, setShippingMethod] = useState("Ekspres");

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalHargaBarang = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const biayaPengiriman = shippingMethod === "Ekspres" ? 25000 : 10000;
  const totalAkhirTagihan = totalHargaBarang + biayaPengiriman;

  const validateForm = () => {
    let tempErrors = {};
    if (!nama.trim()) tempErrors.nama = "Nama penerima wajib diisi!";
    if (!telepon.trim()) tempErrors.telepon = "Nomor telepon wajib diisi!";
    if (!alamat.trim()) tempErrors.alamat = "Alamat pengiriman lengkap wajib diisi!";
    if (!checkoutItems || checkoutItems.length === 0) {
      tempErrors.cart = "Tidak ada produk obat yang bisa diproses. Silakan pilih obat di keranjang terlebih dahulu!";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      // 🧼 100% CLEAN ARCHITECTURE: Variabel token lama dan header Authorization manual dihapus total!
      // Karena string Bearer JWT sudah disisipkan secara otomatis oleh interceptor di http.js
      const dataPayload = {D
        nama,
        telepon,
        alamat,
        catatan,
        shippingMethod,
        total_price: totalAkhirTagihan,
        items: checkoutItems,
      };

      // Tembak langsung endpoint API internal proxy tanpa ribet mikirin payload header
      const response = await http.post("/checkout", dataPayload);

      if (response.data) {
        if (onExecutePayment) onExecutePayment(dataPayload);
        navigate("/");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal memproses checkout transaksi ke server.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1150px", margin: "2rem auto", padding: "0 1.5rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ margin: 0, fontSize: "14px", color: "#10b981", fontWeight: "700" }}>Checkout Pesanan</p>
          <h1 style={{ margin: "0.35rem 0 0", fontSize: "2rem", color: "#0f172a" }}>Lengkapi Data Pengiriman</h1>
        </div>
        <button onClick={() => navigate("/cart")} style={{ padding: "0.95rem 1.75rem", borderRadius: "14px", border: "1px solid #d1d5db", backgroundColor: "#ffffff", fontWeight: "700", cursor: "pointer" }}>
          Kembali ke Keranjang
        </button>
      </div>

      {errors.cart && (
        <div style={{ padding: "1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "16px", marginBottom: "1.5rem", fontWeight: "600" }}>
          {errors.cart}
        </div>
      )}
      {apiError && (
        <div style={{ padding: "1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "16px", marginBottom: "1.5rem", fontWeight: "600" }}>
          {apiError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.45fr 0.95fr", gap: "2rem" }}>
        <section style={{ backgroundColor: "#ffffff", borderRadius: "26px", padding: "2rem", border: "1px solid #e2e8f0" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ margin: 0, color: "#10b981", fontWeight: "700", fontSize: "14px" }}>Alamat Pengiriman</p>
            <h2 style={{ margin: "0.5rem 0 0", color: "#0f172a" }}>Lengkapi informasi penerima</h2>
          </div>

          <form onSubmit={handleSubmitOrder}>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "0.55rem", color: "#334155" }}>Nama Penerima</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Penerima"
                  style={{ width: "100%", padding: "1rem", borderRadius: "18px", border: errors.nama ? "1px solid #ef4444" : "1px solid #d1d5db", fontSize: "15px" }}
                />
                {errors.nama && <p style={{ margin: "0.5rem 0 0", color: "#ef4444", fontSize: "13px" }}>{errors.nama}</p>}
              </div>

              <div>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "0.55rem", color: "#334155" }}>Alamat Lengkap</label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Alamat Lengkap (Nama Jalan, No. Rumah, Kelurahan)"
                  style={{ width: "100%", minHeight: "120px", padding: "1rem", borderRadius: "18px", border: errors.alamat ? "1px solid #ef4444" : "1px solid #d1d5db", fontSize: "15px", fontFamily: "sans-serif" }}
                />
                {errors.alamat && <p style={{ margin: "0.5rem 0 0", color: "#ef4444", fontSize: "13px" }}>{errors.alamat}</p>}
              </div>

              <div>
                <label style={{ display: "block", fontWeight: "700", marginBottom: "0.55rem", color: "#334155" }}>Nomor Telepon</label>
                <input
                  type="text"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="Nomor Telepon (WhatsApp)"
                  style={{ width: "100%", padding: "1rem", borderRadius: "18px", border: errors.telepon ? "1px solid #ef4444" : "1px solid #d1d5db", fontSize: "15px" }}
                />
                {errors.telepon && <p style={{ margin: "0.5rem 0 0", color: "#ef4444", fontSize: "13px" }}>{errors.telepon}</p>}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ margin: "0 0 0.85rem", fontWeight: "700", color: "#334155" }}>Metode Pengiriman</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <button type="button" onClick={() => setShippingMethod("Ekspres")} style={{ padding: "1.2rem", borderRadius: "20px", border: shippingMethod === "Ekspres" ? "2px solid #10b981" : "1px solid #d1d5db", backgroundColor: shippingMethod === "Ekspres" ? "#ecfdf5" : "#ffffff", cursor: "pointer", textAlign: "left" }}>
                  <p style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>Ekspres (1 Hari)</p>
                  <p style={{ margin: "0.5rem 0 0", color: "#64748b", fontSize: "14px" }}>Kurir instan, Rp 25.000</p>
                </button>
                <button type="button" onClick={() => setShippingMethod("Reguler")} style={{ padding: "1.2rem", borderRadius: "20px", border: shippingMethod === "Reguler" ? "2px solid #10b981" : "1px solid #d1d5db", backgroundColor: shippingMethod === "Reguler" ? "#ecfdf5" : "#ffffff", cursor: "pointer", textAlign: "left" }}>
                  <p style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>Reguler (2-3 Hari)</p>
                  <p style={{ margin: "0.5rem 0 0", color: "#64748b", fontSize: "14px" }}>Kurir standar, Rp 10.000</p>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "1rem", borderRadius: "18px", backgroundColor: "#10b981", color: "#ffffff", border: "none", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Memproses Order..." : "Konfirmasi & Bayar"}
            </button>
          </form>
        </section>

        <aside style={{ backgroundColor: "#ffffff", borderRadius: "26px", padding: "2rem", border: "1px solid #e2e8f0", position: "sticky", top: "1rem", height: "fit-content" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#10b981", fontWeight: "700" }}>Ringkasan Pesanan</p>
            <h2 style={{ margin: "0.5rem 0 0", color: "#0f172a" }}>Detail Pesanan</h2>
          </div>

          <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
            {checkoutItems.map((item) => (
              <div key={item.id || item.medicine_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", padding: "1rem", borderRadius: "18px", backgroundColor: "#f8fafc" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>{item.name || item.title}</p>
                  <p style={{ margin: "0.35rem 0 0", color: "#64748b", fontSize: "13px" }}>{item.quantity} x</p>
                </div>
                <p style={{ margin: 0, fontWeight: "700", color: "#10b981" }}>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem", display: "grid", gap: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
              <span>Subtotal</span>
              <span>Rp {totalHargaBarang.toLocaleString("id-ID")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
              <span>Biaya Pengiriman</span>
              <span>Rp {biayaPengiriman.toLocaleString("id-ID")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#0f172a", fontSize: "18px" }}>
              <span>Total Bayar</span>
              <span>Rp {totalAkhirTagihan.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <p style={{ margin: 0, color: "#64748b", fontSize: "13px", marginTop: "1rem" }}>*Pesanan obat keras wajib menunjukkan resep asli saat kurir sampai.</p>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
