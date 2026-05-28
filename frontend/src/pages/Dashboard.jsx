import { useState, useRef } from "react";

function Dashboard({ currentUser, onUpdateProfile, onViewChange }) {
  const [activeTab, setActiveTab] = useState("profile"); // Tab: 'profile' atau 'orders'
  
  // State untuk menyimpan preview foto profil (Default: avatar kosong)
  const [avatarPreview, setAvatarPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  
  // Ref untuk memicu klik pada input file tersembunyi
  const fileInputRef = useRef(null);

  // State form untuk info profil sesuai mockup terbaru kamu
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "Ahmad Miftahuddin",
    email: currentUser?.email || "mimi@klinik.com",
    phone: "081234567890",
    address: ""
  });

  const dummyOrders = [
    {
      id: "ORD-20260519-01",
      date: "19 Mei 2026",
      items: "Paracetamol (2 Strip), Vitamin C (1 Botol)",
      total: 35000,
      status: "Selesai"
    }
  ];

  // Fungsi menangani perubahan input text
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  // 📸 Fungsi memicu jendela pilih file
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // 📸 Fungsi menangkap file gambar & membuat preview lokal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran maks 5MB sesuai mockup kamu
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 5MB.");
        return;
      }
      // Membuat URL lokal sementara untuk preview gambar
      const localUrl = URL.createObjectURL(file);
      setAvatarPreview(localUrl);
    }
  };

  // 📸 Fungsi menghapus foto / reset ke default
  const handleRemovePhoto = () => {
    setAvatarPreview("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("🎉 Perubahan info akun berhasil disimpan!");
    onUpdateProfile({ ...currentUser, name: profileForm.name, email: profileForm.email });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem", fontFamily: "inherit" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem" }}>Dashboard Akun</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* SIDEBAR DASHBOARD */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ padding: "0.5rem 0.75rem", marginBottom: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>
            <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1.05rem" }}>Halo, {profileForm.name}</h4>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{currentUser?.role || "Pelanggan"}</span>
          </div>

          <button 
            type="button"
            onClick={() => setActiveTab("profile")}
            style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", borderRadius: "10px", border: "none", backgroundColor: activeTab === "profile" ? "#edfaf4" : "transparent", color: activeTab === "profile" ? "#0fa968" : "#475569", fontWeight: activeTab === "profile" ? "700" : "500", cursor: "pointer", fontSize: "0.95rem" }}
          >
            👤 Informasi Akun
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("orders")}
            style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", borderRadius: "10px", border: "none", backgroundColor: activeTab === "orders" ? "#edfaf4" : "transparent", color: activeTab === "orders" ? "#0fa968" : "#475569", fontWeight: activeTab === "orders" ? "700" : "500", cursor: "pointer", fontSize: "0.95rem" }}
          >
            📦 Riwayat Pesanan
          </button>

          <button 
            type="button"
            onClick={() => {
              onUpdateProfile(null);
              onViewChange("katalog");
              alert("Anda telah logout.");
            }}
            style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", borderRadius: "10px", border: "none", backgroundColor: "transparent", color: "#ef4444", fontWeight: "600", cursor: "pointer", fontSize: "0.95rem", marginTop: "1rem" }}
          >
            🚪 Keluar / Logout
          </button>
        </div>

        {/* KONTEN UTAMA DASHBOARD */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "24px", overflow: "hidden" }}>
          
          {/* TAB: EDIT PROFILE */}
          {activeTab === "profile" && (
            <div>
              {/* 📸 BANNER UPDATE PHOTO PROFILE (Sesuai gambar mockup kamu) */}
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", backgroundColor: "#e2e8f0", padding: "2rem", borderBottom: "1px solid #cbd5e1" }}>
                <div style={{ position: "relative", width: "100px", height: "100px" }}>
                  <img 
                    src={avatarPreview} 
                    alt="Profile Avatar" 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid #ffffff", backgroundColor: "#f8fafc" }}
                  />
                  <div onClick={handleUploadClick} style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#1e293b", color: "white", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.85rem" }}>
                    📷
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>Update Photo Profile</h4>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                    {/* Hidden Native File Input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/png, image/jpeg" 
                      style={{ display: "none" }} 
                    />
                    <button type="button" onClick={handleUploadClick} style={{ backgroundColor: "#0fa968", color: "white", border: "none", padding: "6px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>
                      ↑ Ubah Foto
                    </button>
                    <button type="button" onClick={handleRemovePhoto} style={{ backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>
                      Hapus Foto
                    </button>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Ganti foto profil Anda. Ukuran maks. 5MB, format JPG/PNG.</p>
                </div>
              </div>

              {/* FORM UTAMA */}
              <form onSubmit={handleSaveProfile} style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Nama Lengkap</label>
                  <input type="text" name="name" value={profileForm.name} onChange={handleInputChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }} required />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Alamat Email</label>
                    <input type="email" name="email" value={profileForm.email} onChange={handleInputChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>No. Telepon</label>
                    <input type="text" name="phone" value={profileForm.phone} onChange={handleInputChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Alamat Lengkap</label>
                  <textarea name="address" value={profileForm.address} onChange={handleInputChange} placeholder="Nama jalan, No. Rumah, Kota" rows="3" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", fontFamily: "inherit", resize: "none", outline: "none" }}></textarea>
                </div>

                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Ganti Kata Sandi</label>
                  <input type="password" placeholder="Masukkan kata sandi baru jika ingin mengubah" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }} />
                </div>

                <button type="submit" style={{ width: "max-content", backgroundColor: "#64748b", color: "#ffffff", border: "none", padding: "0.75rem 2rem", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "1rem" }}>
                  Simpan Perubahan
                </button>
              </form>
            </div>
          )}

          {/* TAB: RIWAYAT PESANAN */}
          {activeTab === "orders" && (
            <div style={{ padding: "2.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0f172a", marginBottom: "1.5rem" }}>Riwayat Pesanan Anda</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {dummyOrders.map((order) => (
                  <div key={order.id} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>{order.date}</span>
                      <h4 style={{ margin: "4px 0 6px 0", color: "#0f172a", fontSize: "1.05rem" }}>{order.id}</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#475569" }}>{order.items}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ display: "block", fontSize: "1.1rem", color: "#1e293b", marginBottom: "6px" }}>Rp {order.total.toLocaleString("id-ID")}</strong>
                      <span style={{ backgroundColor: "#dcfce7", color: "#15803d", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "700" }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;