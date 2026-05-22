import { useState } from "react";
import medicineData from "../utils/constants/medicineData";
import MedicineCard from "../components/MedicineCard/MedicineCard";
import Hero from "../components/Hero/Hero";

function Home({ onAddToCart }) {
  // 1. State untuk memegang kategori yang sedang aktif diklik (Default: 'Semua')
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // 2. Data daftar kategori dummy (Nanti dicocokkan dengan master tabel kategori di MySQL kamu)
  const categories = [
    { id: "all", name: "Semua" },
    { id: "cat-01", name: "Vitamin" },
    { id: "cat-02", name: "Obat Flu" },
    { id: "cat-03", name: "P3K" },
    { id: "cat-04", name: "Masker" }
  ];

  // 3. Tambahkan properti categoryId secara internal pada data obat dummy kita
  // (Ini simulasi relasi database id_kategori)
  const obatWithCategory = medicineData.map((obat) => {
    if (obat.id === "med-01") return { ...obat, categoryId: "cat-02", categoryName: "Obat Flu" }; // Paracetamol
    if (obat.id === "med-02") return { ...obat, categoryId: "cat-01", categoryName: "Vitamin" };  // Amoxicillin / Vitamin C Orange
    if (obat.id === "med-03") return { ...obat, categoryId: "cat-01", categoryName: "Vitamin" };  // Vitamin C 1000mg
    return { ...obat, categoryId: "cat-03", categoryName: "P3K" }; // Default cadangan jika ada obat lain
  });

  // 4. Logika memfilter obat berdasarkan tombol kategori yang diklik
  const filteredObat = selectedCategory === "Semua" 
    ? obatWithCategory 
    : obatWithCategory.filter((obat) => obat.categoryName === selectedCategory);

  return (
    <div>
      {/* Hero Section Banner */}
      <Hero />

      {/* Konten Utama */}
      <div style={{ maxWidth: "1200px", margin: "4rem auto 2rem auto", padding: "0 2rem" }}>
        
        {/* 🗂️ SEKSI SEARCH BY KATEGORI (Sesuai Struktur Database Kamu) */}
        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
            Cari Berdasarkan Kategori
          </h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: isActive ? "#0fa968" : "#ffffff",
                    color: isActive ? "#ffffff" : "#0fa968",
                    border: "2px solid #0fa968",
                    borderRadius: "100px",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: isActive ? "0 4px 12px rgba(15, 169, 104, 0.2)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Katalog Obat */}
        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              🌿 Produk Kesehatan ({selectedCategory})
            </h2>
            <span style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: "600" }}>
              Menampilkan {filteredObat.length} Produk
            </span>
          </div>
          
          {filteredObat.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              Belum ada stok obat untuk kategori ini.
            </div>
          ) : (
            /* Tampilan Grid Katalog */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
              {filteredObat.map((obat) => (
                <MedicineCard 
                  key={obat.id} 
                  obat={obat} 
                  onAddToCart={onAddToCart} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;