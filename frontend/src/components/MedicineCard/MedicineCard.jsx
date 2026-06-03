import styles from "./MedicineCard.module.css";

function MedicineCard({ obat, onAddToCart }) {
  // 💡 SINKRONISASI TOTAL DENGAN KOLOM DATABASE MYSQL KAMU:
  const namaObat = obat.name;          // Menangkap kolom 'name' dari SQL
  const deskripsiObat = obat.description; // Menangkap kolom 'description' dari SQL
  const hargaObat = obat.price;        // Menangkap kolom 'price' dari SQL
  const stokObat = obat.stock;          // Menangkap kolom 'stock' dari SQL (Penyebab angka 0 tadi 🚀)

  // Pengaman gambar dummy seperti sebelumnya
  const isUrlValid = obat.image && (obat.image.startsWith("http://") || obat.image.startsWith("https://"));
  const gambarObat = isUrlValid ? obat.image : "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500";

  return (
    // ... Sisa kode layout HTML/JSX ke bawah tetap sama persis dengan yang kamu punya ...
    <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
      
      {/* Badge Stok */}
      <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#fee2e2", color: "#ef4444", padding: "2px 8px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "750" }}>
        Sisa {stokObat}
      </span>

      {/* Gambar Obat */}
      <img 
        src={gambarObat} 
        alt={namaObat} 
        style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", marginBottom: "1rem" }} 
      />

      {/* Teks Konten */}
      <div>
        <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a", marginBottom: "6px" }}>
          {namaObat}
        </h4>
        <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.4", minHeight: "60px", marginBottom: "1rem" }}>
          {deskripsiObat}
        </p>
      </div>

      {/* Bagian Bawah: Harga & Aksi */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
        <div>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Harga</span>
          <strong style={{ display: "block", fontSize: "1.1rem", color: "#ef4444", fontWeight: "800" }}>
            Rp {hargaObat.toLocaleString("id-ID")}
          </strong>
        </div>
        
        <div style={{ display: "flex", gap: "6px" }}>
          <button type="button" style={{ backgroundColor: "#f1f5f9", color: "#64748b", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>
            Detail
          </button>
          <button 
            type="button" 
            onClick={() => onAddToCart(obat)}
            style={{ backgroundColor: "#0fa968", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}
          >
            Beli
          </button>
        </div>
      </div>

    </div>
  );
}

export default MedicineCard;