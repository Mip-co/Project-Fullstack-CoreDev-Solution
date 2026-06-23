import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/api/authApi"; //

function Register() {
  const navigate = useNavigate();

  // STATE MANAGEMENT
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let tempErrors = {};
    if (!name.trim()) tempErrors.name = "Nama lengkap wajib diisi!";
    if (!email.trim()) tempErrors.email = "Email address wajib diisi!";
    if (!password) tempErrors.password = "Password baru wajib diisi!";
    if (!confirmPassword) {
      tempErrors.confirmPassword = "Konfirmasi password wajib diisi!";
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Konfirmasi password tidak cocok!"; //
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerUser({ name, email, password, password_confirmation: confirmPassword });
      setSuccessMsg("🎉 Pendaftaran berhasil! Mengalihkan ke halaman login...");
      setTimeout(() => {
        navigate("/login"); //
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Registrasi gagal, silakan periksa kelengkapan data.";
      setApiError(msg); //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "block", minHeight: "85vh", backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
      {/* Container Utama Split Screen */}
      <div style={{ display: "table", width: "100%", maxWidth: "1050px", margin: "3rem auto", boxShadow: "0 10px 25px rgba(0,0,0,0.04)", borderRadius: "16px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
        <div style={{ display: "table-row" }}>
          
          {/* SISI KIRI: ILUSTRASI ROKET APOTEKNOW */}
          <div style={{ display: "table-cell", width: "45%", backgroundColor: "#f0fdf4", verticalAlign: "middle", textAlign: "center", padding: "3rem 2rem" }}>
            <svg width="180" height="180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "1.5rem" }}>
              <path d="M12 2C12 2 15 6 15 11C15 15.42 13.66 18.16 12 22C10.34 18.16 9 15.42 9 11C9 6 12 2 12 2Z" fill="#10b981" />
              <path d="M12 2C12 2 13.5 6 13.5 11C13.5 14.5 12.83 16.5 12 19C11.17 16.5 10.5 14.5 10.5 11C10.5 6 12 2 12 2Z" fill="#059669" />
              <circle cx="12" cy="9" r="1.5" fill="#ffffff" />
              <path d="M9 17C7.5 18 6 21 6 21C6 21 9 19.5 10 18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15 17C16.5 18 18 21 18 21C18 21 15 19.5 14 18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h3 style={{ color: "#065f46", margin: "0 0 0.5rem 0", fontSize: "20px", fontWeight: "700" }}>Gabung Bersama Kami</h3>
            <p style={{ color: "#047857", margin: 0, fontSize: "14px", lineHeight: "1.5" }}>Dapatkan kemudahan mengelola resep obat dan rekam transaksi medis dalam satu genggaman platform terpadu.</p>
          </div>

          {/* SISI KANAN: FORM ISIAN UTAMA */}
          <div style={{ display: "table-cell", width: "55%", backgroundColor: "#ffffff", padding: "3rem 3rem", verticalAlign: "middle" }}>
            <h2 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "24px", fontWeight: "700" }}>Create an account</h2>
            <p style={{ color: "#64748b", margin: "0 0 2rem 0", fontSize: "14px" }}>Daftarkan data diri Anda untuk mulai berbelanja kebutuhan medis.</p>

            {/* CONDITIONAL RENDERING: Alert Status Server */}
            {apiError && <div style={{ padding: "0.75rem 1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "14px", border: "1px solid #fee2e2" }}>⚠️ {apiError}</div>}
            {successMsg && <div style={{ padding: "0.75rem 1rem", backgroundColor: "#ecfdf5", color: "#047857", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: "500", border: "1px solid #d1fae5" }}>{successMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: errors.name ? "1px solid #ef4444" : "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px", outline: "none" }}
                  placeholder="Ahmad Miftah"
                />
                {errors.name && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "0.3rem", margin: 0 }}>{errors.name}</p>}
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: errors.email ? "1px solid #ef4444" : "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px", outline: "none" }}
                  placeholder="nama@domain.com"
                />
                {errors.email && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "0.3rem", margin: 0 }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: errors.password ? "1px solid #ef4444" : "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px", outline: "none" }}
                  placeholder="Minimal 8 karakter"
                />
                {errors.password && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "0.3rem", margin: 0 }}>{errors.password}</p>}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: errors.confirmPassword ? "1px solid #ef4444" : "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px", outline: "none" }}
                  placeholder="Ulangi password"
                />
                {errors.confirmPassword && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "0.3rem", margin: 0 }}>{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "0.8rem", backgroundColor: loading ? "#94a3b8" : "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px", transition: "0.2s", boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)" }}
              >
                {loading ? "Registering Account..." : "Register"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "14px", color: "#64748b" }}>
              Sudah memiliki akun resmi?{" "}
              <Link to="/login" style={{ color: "#10b981", fontWeight: "600", textDecoration: "none" }}>
                Masuk Di Sini
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;