import { useState } from "react";

function Register({ onViewChange }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman [cite: 1339]
    
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Konfirmasi password tidak cocok!");
      return;
    }

    alert(`🎉 Akun dummy untuk "${formData.name}" berhasil dibuat!\nSilakan login menggunakan email tersebut.`);
    onViewChange("login"); // Arahkan ke halaman login setelah daftar
  };

  return (
    <div style={{ maxWidth: "420px", margin: "4rem auto", padding: "0 1.5rem" }}>
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", padding: "2.5rem", borderRadius: "24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.02)" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.5rem", textAlign: "center" }}>Daftar Akun</h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem", textAlign: "center", marginBottom: "2rem" }}>Lengkapi data untuk bergabung dengan ApotekApp</p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Nama Lengkap</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Alamat Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="contoh@email.com"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Minimal 6 karakter"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Konfirmasi Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Ulangi password Anda"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }}
              required
            />
          </div>

          <button 
            type="submit"
            style={{ width: "100%", backgroundColor: "#0fa968", color: "#ffffff", border: "none", padding: "0.85rem", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "0.5rem" }}
          >
            Daftar Akun
          </button>
        </form>

        <p style={{ fontSize: "0.9rem", color: "#64748b", textAlign: "center", marginTop: "1.5rem" }}>
          Sudah punya akun?{" "}
          <span onClick={() => onViewChange("login")} style={{ color: "#0fa968", fontWeight: "700", cursor: "pointer" }}>
            Masuk Di Sini
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;