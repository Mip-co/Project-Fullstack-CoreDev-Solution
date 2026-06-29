import React, { useState, useEffect } from "react";
import http from "../utils/api/http"; 
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  // State Kontrol Menu Sidebar (Tab Aktif)
  const [activeTab, setActiveTab] = useState("profile");

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState("");

  // State Mode Edit Form Profil
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");

  // Ambil data profile paling update langsung via API dari database MySQL kelompok
  useEffect(() => {
    const fetchLatestUserProfile = async () => {
      if (!user || !user.id) return;
      try {
        const response = await http.get(`/users/${user.id}`);
        const dbUser = response.data?.data || response.data?.user || response.data;
        if (dbUser) {
          setFormData({
            name: dbUser.name || dbUser.username || user.name || "",
            phone: dbUser.phone || dbUser.no_hp || dbUser.telepon || user.phone || "",
            address: dbUser.address || dbUser.alamat || user.address || ""
          });
          if (dbUser.profile_picture || dbUser.photo) {
            setPreviewUrl(`http://localhost:3000/uploads/${dbUser.profile_picture || dbUser.photo}`);
          }
        }
      } catch (err) {
        console.error("Gagal menarik profile segar dari MySQL, gunakan fallback token:", err);
        setFormData({
          name: user.name || "",
          phone: user.phone || user.no_hp || "",
          address: user.address || user.alamat || ""
        });
        setPreviewUrl(user.profile_picture ? `http://localhost:3000/uploads/${user.profile_picture}` : "");
      }
    };

    fetchLatestUserProfile();
  }, [user]);

  // Ambil data transaksi riwayat pesanan dari database MySQL kelompok
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user || !user.id) return;
      
      setLoadingOrders(true);
      setErrorOrders("");
      try {
        const response = await http.get(`/orders/history/${user.id}`);
        if (response.data && response.data.success) {
          setOrders(response.data.data || response.data.orders || []);
        } else if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders(response.data?.orders || []);
        }
      } catch (err) {
        console.error("Gagal memuat histori transaksi:", err);
        setErrorOrders(err.response?.data?.message || "Gagal menarik data dari MySQL.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrderHistory();
  }, [user]);

  // Handle Perubahan input file gambar & bikin preview instan di client
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle Simpan Perubahan (Strategi Dual-Hit Request ke Backend)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccess("");

    try {
      // 1️⃣ REQUEST PERTAMA: Kirim data teks berupa JSON ke UserController milik Alam
      const textData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };
      const responseText = await http.put(`/users/${user.id}`, textData);

      // 2️⃣ REQUEST KEDUA: Jika ada file foto baru yang dipilih, unggah pakai FormData ke AuthController
      if (selectedFile) {
        const imageData = new FormData();
        imageData.append("photo", selectedFile); 

        await http.put("/profile/image", imageData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      // 3️⃣ Cek token baru jika dikembalikan backend
      const newToken = responseText.data?.token || responseText.data?.data?.token;
      if (newToken) {
        localStorage.setItem("token", newToken);
      }

      setEditSuccess("🎉 Profil dan foto baru berhasil diperbarui secara permanen!");
      setIsEditing(false);

      // Reload halaman agar useEffect memicu fetch profil terbaru yang segar dari MySQL
      setTimeout(() => {
        window.location.reload();
      }, 800);

    } catch (err) {
      console.error("Gagal sinkronisasi update profil:", err);
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan perubahan ke server database.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      
      {/* ────────────────────────────────────────────────────────
          SISI KIRI: SIDEBAR NAVBAR (INFO USER, MENU, LOGOUT)
          ──────────────────────────────────────────────────────── */}
      <div style={{ flex: "1 1 280px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "2rem 1.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "520px" }}>
        
        <div>
          {/* User Info Container */}
          <div style={{ textAlign: "center", marginBottom: "2rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem" }}>
            <div style={{ width: "75px", height: "75px", margin: "0 auto 0.75rem auto", position: "relative" }}>
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid #10b981" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#64748b", border: "3px solid #10b981" }}>👤</div>
              )}
            </div>
            <h3 style={{ margin: "0 0 0.25rem 0", color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>{formData.name || "Memuat..."}</h3>
            <span style={{ padding: "0.2rem 0.6rem", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "50px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>
              {user?.role || "user"}
            </span>
          </div>

          {/* Navigasi List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button
              onClick={() => { setActiveTab("profile"); setIsEditing(false); }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.8rem 1rem", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", textAlign: "left", cursor: "pointer", transition: "0.2s",
                backgroundColor: activeTab === "profile" ? "#e6f4ea" : "transparent",
                color: activeTab === "profile" ? "#10b981" : "#475569"
              }}
            >
              👤 Info Akun
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.8rem 1rem", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", textAlign: "left", cursor: "pointer", transition: "0.2s",
                backgroundColor: activeTab === "orders" ? "#e6f4ea" : "transparent",
                color: activeTab === "orders" ? "#10b981" : "#475569"
              }}
            >
              📦 Riwayat Pesanan
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          style={{ width: "100%", padding: "0.75rem", backgroundColor: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          onMouseOver={(e) => { e.target.style.backgroundColor = "#ef4444"; e.target.style.color = "#ffffff"; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = "#fef2f2"; e.target.style.color = "#ef4444"; }}
        >
          🚪 Keluar Akun
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────
          SISI KANAN: AREA PANEL KONTEN UTAMA (KONTEN DINAMIS)
          ──────────────────────────────────────────────────────── */}
      <div style={{ flex: "2 1 650px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "2.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
        
        {editSuccess && (
          <div style={{ padding: "1rem", backgroundColor: "#dcfce7", color: "#15803d", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: "600" }}>
            {editSuccess}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <div style={{ marginBottom: "1.5rem", borderBottom: "2px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              <h2 style={{ margin: 0, color: "#0f172a", fontSize: "20px", fontWeight: "800" }}>Informasi Akun</h2>
              <p style={{ margin: "0.25rem 0 0 0", color: "#64748b", fontSize: "13px" }}>Kelola data diri pribadi dan pengaturan foto profil medis Anda.</p>
            </div>

            {!isEditing ? (
              /* VIEW MODE */
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center", backgroundColor: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar" style={{ width: "65px", height: "65px", borderRadius: "50%", objectFit: "cover", border: "2px solid #10b981" }} />
                  ) : (
                    <div style={{ width: "65px", height: "65px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>👤</div>
                  )}
                  <div>
                    <h4 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: "700" }}>{formData.name || "Pengguna Apotek"}</h4>
                    {/* 🔑 BERSIH: Teks ID Pelanggan Amaya yang bocor sudah resmi dihapus total dari baris ini! */}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                  <div style={{ padding: "1rem", border: "1px solid #f1f5f9", borderRadius: "10px" }}>
                    <span style={{ display: "block", color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Email Terdaftar</span>
                    <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>{user?.email || "-"}</span>
                  </div>
                  <div style={{ padding: "1rem", border: "1px solid #f1f5f9", borderRadius: "10px" }}>
                    <span style={{ display: "block", color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Nomor Telepon</span>
                    <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>
                      {formData.phone || "Belum diisi"} 
                    </span>
                  </div>
                </div>

                <div style={{ padding: "1rem", border: "1px solid #f1f5f9", borderRadius: "10px" }}>
                  <span style={{ display: "block", color: "#94a3b8", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>Alamat Lengkap Pengiriman</span>
                  <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px", lineHeight: "1.5" }}>
                    {formData.address || "Belum diisi"} 
                  </span>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{ width: "fit-content", padding: "0.6rem 1.5rem", backgroundColor: "#10b981", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", marginTop: "0.5rem", transition: "0.2s" }}
                >
                  ⚙️ Ubah Data Akun
                </button>
              </div>
            ) : (
              /* EDIT MODE */
              <form onSubmit={handleUpdateProfile}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "0.5rem", border: "2px solid #10b981" }} />
                  ) : (
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#e2e8f0", margin: "0 auto 0.5rem auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>👤</div>
                  )}
                  <label style={{ display: "block", fontSize: "12px", color: "#10b981", fontWeight: "700", cursor: "pointer" }}>
                    Ganti Berkas Foto Profil
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                  </label>
                </div>

                <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "0.35rem" }}>Nama Lengkap</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "0.35rem" }}>Nomor Telepon</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Contoh: 081234567" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "0.35rem" }}>Alamat Lengkap</label>
                    <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Nama Jalan, RT/RW, No. Rumah" style={{ width: "100%", minHeight: "75px", padding: "0.6rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontFamily: "sans-serif" }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ padding: "0.55rem 1.2rem", backgroundColor: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>Batal</button>
                  <button type="submit" disabled={editLoading} style={{ padding: "0.55rem 1.5rem", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: editLoading ? "not-allowed" : "pointer", fontSize: "14px" }}>
                    {editLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 📦 VIEW TAB 2: RIWAYAT TRANSAKSI CHECKOUT */}
        {activeTab === "orders" && (
          <div>
            <div style={{ marginBottom: "1.5rem", borderBottom: "2px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              <h2 style={{ margin: 0, color: "#0f172a", fontSize: "20px", fontWeight: "800" }}>Riwayat Transaksi</h2>
              <p style={{ margin: "0.25rem 0 0 0", color: "#64748b", fontSize: "13px" }}>Pantau status pemesanan obat dan rekam kuitansi belanja klinik Anda.</p>
            </div>

            {loadingOrders ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>⏳ Menghubungkan ke MySQL database...</p>
            ) : errorOrders ? (
              <div style={{ padding: "1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "6px", fontSize: "14px" }}>⚠️ Galat: {errorOrders}</div>
            ) : orders.length === 0 ? (
              <div style={{ padding: "3rem 1rem", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Belum ada kuitansi pembelian yang terekam di akun ini.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>ID Nota</th>
                      <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>Tanggal</th>
                      <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>Total Bayar</th>
                      <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: "700" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "1rem", fontWeight: "700", color: "#0f172a" }}>#TRX-{order.id}</td>
                        <td style={{ padding: "1rem", color: "#475569" }}>{order.created_at ? new Date(order.created_at).toLocaleDateString("id-ID") : "Baru Saja"}</td>
                        <td style={{ padding: "1rem", fontWeight: "600", color: "#0f172a" }}>Rp {Number(order.total_price || 0).toLocaleString("id-ID")}</td>
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
        )}

      </div>
    </div>
  );
}

export default Dashboard;