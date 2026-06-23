import React, { useState, useEffect } from "react";
import http from "../utils/api/http"; 
// 🔑 IMPORT CUSTOM HOOK UTAMA SPRINT 13 KELOMPOK
import { useAuth } from "../context/AuthContext";

// 🗑️ PEMBERSIHAN PROP: Hapus properti props drilling lama karena semuanya dikelola terpusat
function Dashboard() {
  // 🔑 Ambil data user yang aktif dan fungsi logout langsung dari Custom Hook useAuth()
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState("");

  // 🗑️ PEMBERSIHAN TOTAL LOGIKA LOKAL: useEffect parsing Base64 token manual sudah dihapus sepenuhnya!
  // Sekarang data user langsung diambil secara instan dari status session verified milik AuthContext.

  // Ambil data transaksi riil dari tabel MySQL kelompok berdasarkan ID user yang sedang login
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user || !user.id) return; // Tunggu sampai ID user dari global context siap
      
      setLoadingOrders(true);
      setErrorOrders("");
      try {
        const token = localStorage.getItem("token");
        const userId = user.id; 
        
        // Ambil data riwayat transaksi asli milik user terkait
        const response = await http.get(`http://localhost:3000/api/orders/history/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.success) {
          setOrders(response.data.data || response.data.orders || []);
        } else if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders(response.data?.orders || []);
        }
      } catch (err) {
        console.error("Gagal memuat histori transaksi database:", err);
        setErrorOrders(err.response?.data?.message || "Gagal menarik data dari MySQL.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrderHistory();
  }, [user]); // Memicu fetch ulang secara reaktif setiap kali data user context ter-load

  return (
    <div style={{ maxWidth: "1100px", margin: "2.5rem auto", padding: "0 1.5rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* HEADER DASHBOARD */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "2px solid #f1f5f9", paddingBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a", fontSize: "24px", fontWeight: "800" }}>Dashboard Pengguna</h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748b", fontSize: "14px" }}>Kelola informasi profil akun dan pantau histori belanja obat Anda.</p>
        </div>
        
        {/* 🔑 TOMBOL LOGOUT GLOBAL: Terhubung langsung ke fungsi logout bawaan useAuth() */}
        <button
          onClick={logout}
          style={{ padding: "0.6rem 1.2rem", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "0.2s", boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)" }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
        >
          🚪 Keluar Akun (Logout)
        </button>
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        
        {/* KARTU PROFIL USER (SISI KIRI) */}
        <div style={{ flex: "1 1 320px", backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", height: "fit-content" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#e2e8f0", margin: "0 auto 1rem auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", color: "#64748b", border: "3px solid #10b981" }}>
              👤
            </div>
            {/* 🔑 SEKARANG NAMANYA REAL-TIME AMAN DARI GLOBAL CONTEXT STATE */}
            <h3 style={{ margin: "0 0 0.25rem 0", color: "#0f172a", fontSize: "18px", fontWeight: "700" }}>
              {user?.name || "Memuat nama..."}
            </h3>
            <span style={{ padding: "0.25rem 0.75rem", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "50px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>
              {user?.role || "user"}
            </span>
          </div>

          <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "1.25rem", fontSize: "14px", color: "#475569" }}>
            <div style={{ marginBottom: "0.75rem" }}>
              <span style={{ display: "block", color: "#94a3b8", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Alamat Email</span>
              <span style={{ fontWeight: "600", color: "#1e293b" }}>
                {user?.email || "Menghubungkan..."}
              </span>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <span style={{ display: "block", color: "#94a3b8", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Status Autentikasi</span>
              <span style={{ fontWeight: "600", color: "#10b981" }}>🟢 Active (Context Verified)</span>
            </div>
          </div>
        </div>

        {/* TABEL RIWAYAT TRANSAKSI REAL DATABASE (SISI KANAN) */}
        <div style={{ flex: "2 1 600px", backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <h3 style={{ marginTop: 0, marginBottom: "1.25rem", color: "#0f172a", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            📦 Riwayat Transaksi Pembelian
          </h3>

          {loadingOrders ? (
            <p style={{ color: "#64748b", fontSize: "14px" }}>⏳ Menghubungkan dan menarik data kuitansi dari MySQL...</p>
          ) : errorOrders ? (
            <div style={{ padding: "1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "6px", fontSize: "14px", fontWeight: "500" }}>
              ⚠️ Galat: {errorOrders}
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "3rem 1rem", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
              <span style={{ fontSize: "2rem" }}>🛒</span>
              <p style={{ margin: "0.5rem 0 0 0", color: "#64748b", fontSize: "14px" }}>Belum ada transaksi checkout obat yang tercatat di akun ini.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>ID Nota</th>
                    <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>Tanggal Pesan</th>
                    <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>Total Bayar</th>
                    <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "1rem", fontWeight: "700", color: "#0f172a" }}>#TRX-{order.id}</td>
                      <td style={{ padding: "1rem", color: "#475569" }}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("id-ID") : "Baru Saja"}
                      </td>
                      <td style={{ padding: "1rem", fontWeight: "600", color: "#0f172a" }}>
                        Rp {Number(order.total_price || 0).toLocaleString("id-ID")}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ padding: "0.25rem 0.6rem", backgroundColor: order.status === "pending" ? "#fef3c7" : "#dcfce7", color: order.status === "pending" ? "#d97706" : "#15803d", borderRadius: "4px", fontSize: "12px", fontWeight: "700" }}>
                          {(order.status || "Sukses").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;