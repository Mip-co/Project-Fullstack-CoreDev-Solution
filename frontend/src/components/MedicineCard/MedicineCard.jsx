import React from "react";
import { Link } from "react-router-dom"; //

function MedicineCard({ obat, onAddToCart }) {
  // Ambil ID aman dari data riil database
  const idObat = obat.medicine_id || obat.id;

  // TARGET ADIT: Logika pemetaan gambar static asset folder uploads backend
  let imageSrc = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"; // Fallback placeholder
  
  if (obat.image) {
    if (obat.image.startsWith("http://") || obat.image.startsWith("https://")) {
      imageSrc = obat.image; // Jika field adalah full URL internet
    } else {
      imageSrc = `http://localhost:3000/uploads/${obat.image}`; // Jika field berupa filename uploads
    }
  }

  // Format harga mata uang rupiah aman
  const formattedPrice = Number(obat.price || 0).toLocaleString("id-ID");

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <img 
          src={imageSrc} 
          alt={obat.name} 
          style={{ width: "100%", height: "180px", objectFit: "cover", backgroundColor: "#f1f5f9" }}
        />
        <div style={{ padding: "1rem" }}>
          <span style={{ fontSize: "12px", backgroundColor: "#d1fae5", color: "#065f46", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "600" }}>
            {obat.category_name || obat.categoryName || "Umum"}
          </span>
          <h4 style={{ margin: "0.5rem 0 0.25rem 0", fontSize: "1.1rem", color: "#1e293b" }}>{obat.name}</h4>
          <p style={{ margin: "0 0 1rem 0", fontSize: "13px", color: "#64748b", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {obat.description || "Tidak ada deskripsi produk obat."}
          </p>
        </div>
      </div>

      <div style={{ padding: "0 1rem 1rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#10b981" }}>Rp {formattedPrice}</span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Stok: {obat.stock ?? 0}</span>
        </div>
        
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {/* TARGET ADIT: Tombol Detail mengarah ke halaman detail via Link SPA */}
          <Link 
            to={`/medicines/${idObat}`} 
            style={{ flex: 1, textDecoration: "none", padding: "0.5rem", textAlign: "center", border: "1px solid #10b981", color: "#10b981", borderRadius: "6px", fontSize: "14px", fontWeight: "600", transition: "0.2s" }}
          >
            Detail
          </Link>
          
          {/* Tombol Beli: Tetap aman mempertahankan fungsi tambahnya */}
          <button
            onClick={() => onAddToCart(obat)}
            disabled={Number(obat.stock || 0) <= 0}
            style={{ flex: 1, padding: "0.5rem", backgroundColor: Number(obat.stock || 0) <= 0 ? "#cbd5e1" : "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: Number(obat.stock || 0) <= 0 ? "not-allowed" : "pointer" }}
          >
            {Number(obat.stock || 0) <= 0 ? "Habis" : "Beli"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;