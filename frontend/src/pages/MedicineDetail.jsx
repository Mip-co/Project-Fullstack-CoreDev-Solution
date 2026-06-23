import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; //
import { getMedicineById } from "../utils/api/medicineApi"; //

function MedicineDetail({ onAddToCart }) {
  // 1. Ambil ID parameter dari URL browser
  const { id } = useParams();

  // 2. State Manajemen UI Detail
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetailObat();
  }, [id]);

  const fetchDetailObat = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMedicineById(id);
      // Validasi struktur data response pembungkus dari backend kelompok
      if (response && response.success) {
        setMedicine(response.data || null);
      } else {
        setMedicine(response || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Gagal menghubungi server backend.");
    } finally {
      setLoading(false);
    }
  };

  // 3. CONDITIONAL RENDERING DETAIL
  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "4rem auto", textAlign: "center", color: "#64748b" }}>
        <h3>⏳ Memuat spesifikasi lengkap produk obat...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "800px", margin: "4rem auto", padding: "1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px" }}>
        <h4>⚠️ Gagal Memuat Data Detail:</h4>
        <p>{error}</p>
        <Link to="/" style={{ color: "#b91c1c", fontWeight: "600" }}> Kembali ke Katalog Beranda</Link>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div style={{ maxWidth: "800px", margin: "4rem auto", textAlign: "center", padding: "2rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
        <h3>🔍 Produk Obat Tidak Ditemukan</h3>
        <p>Maaf, data obat dengan ID tersebut tidak tercatat di dalam database sistem kami.</p>
        <Link to="/" style={{ display: "inline-block", marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#10b981", color: "#fff", textDecoration: "none", borderRadius: "6px" }}>Kembali ke Katalog</Link>
      </div>
    );
  }

  // Pengkondisian jalur gambar static asset uploads backend
  let imageSrc = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600";
  if (medicine.image) {
    imageSrc = medicine.image.startsWith("http") ? medicine.image : `http://localhost:3000/uploads/${medicine.image}`;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "2rem", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", fontFamily: "sans-serif" }}>
      {/* Tombol kembali ke katalog */}
      <Link to="/" style={{ display: "inline-block", textDecoration: "none", color: "#64748b", fontWeight: "600", marginBottom: "1.5rem", fontSize: "14px" }}>
        ← Kembali ke Katalog Obat
      </Link>

      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
        {/* Kolom Kiri: Visual Gambar */}
        <div style={{ flex: "1 1 350px" }}>
          <img 
            src={imageSrc} 
            alt={medicine.name} 
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </div>

        {/* Kolom Kanan: Rincian Data Obat dari Backend */}
        <div style={{ flex: "1.2 1 400px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "13px", backgroundColor: "#ecfdf5", color: "#047857", padding: "0.3rem 0.75rem", borderRadius: "4px", fontWeight: "700" }}>
              {medicine.category_name || medicine.categoryName || "Umum"}
            </span>
            <h2 style={{ margin: "0.75rem 0 0.5rem 0", color: "#1e293b", fontSize: "2rem" }}>{medicine.name}</h2>
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#10b981", fontSize: "1.5rem", fontWeight: "700" }}>
              Rp {Number(medicine.price || 0).toLocaleString("id-ID")}
            </h3>
            
            <hr style={{ border: "0", borderTop: "1px solid #edf2f7", marginBottom: "1.25rem" }} />
            
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#475569" }}>Deskripsi Produk</h4>
            <p style={{ margin: "0 0 1.5rem 0", color: "#64748b", lineHeight: "1.6", fontSize: "15px" }}>
              {medicine.description || "Deskripsi khasiat produk obat belum dicantumkan oleh admin apotek."}
            </p>
            
            <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "14px" }}><strong>Status Ketersediaan:</strong> {Number(medicine.stock || 0) > 0 ? "🟢 Tersedia" : "🔴 Habis"}</p>
              <p style={{ margin: 0, fontSize: "14px" }}><strong>Jumlah Stok Gudang:</strong> {medicine.stock ?? 0} pcs</p>
            </div>
          </div>

          {/* Tombol Aksi Keranjang */}
          <button
            onClick={() => onAddToCart(medicine)}
            disabled={Number(medicine.stock || 0) <= 0}
            style={{ width: "100%", padding: "0.9rem", backgroundColor: Number(medicine.stock || 0) <= 0 ? "#cbd5e1" : "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "700", cursor: Number(medicine.stock || 0) <= 0 ? "not-allowed" : "pointer", transition: "0.2s" }}
          >
            {Number(medicine.stock || 0) <= 0 ? "Stok Obat Habis" : "Masukkan ke Keranjang Belanja"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetail;