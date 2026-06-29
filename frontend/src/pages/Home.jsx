import { useState, useEffect } from "react";
import { getMedicines } from "../utils/api/medicineApi"; 
import MedicineCard from "../components/MedicineCard/MedicineCard"; 
import Hero from "../components/Hero/Hero"; 

function Home({ onAddToCart }) {
  const [medicines, setMedicines] = useState([]); 
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);       
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  // State pencarian terhubung langsung ke katalog bawah
  const [searchQuery, setSearchQuery] = useState("");

  // KATEGORI SINKRON DATABASE
  const categories = [
    { id: "all", name: "Semua", icon: "🏥" },
    { id: "cat-1", name: "Obat Bebas", icon: "💊" },
    { id: "cat-2", name: "Obat Keras", icon: "⚕️" },
    { id: "cat-3", name: "Vitamin & Suplemen", icon: "🌿" },
    { id: "cat-4", name: "Alat Kesehatan Modern", icon: "🩺" },
    { id: "cat-5", name: "Kosmetik Medis (Skincare)", icon: "✨" },
    { id: "cat-6", name: "Kotak P3K & Perban", icon: "🩹" }
  ];

  useEffect(() => {
    async function fetchMedicineData() {
      try {
        setLoading(true);
        setError(null);
        const response = await getMedicines(); 
        setMedicines(response.data?.data || response.data || response); 
      } catch (err) {
        setError(err.message || "Gagal memuat data dari server backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchMedicineData();
  }, []); 

  // LOGIKA FILTERING REALTIME (Kategori + Search)
  const filteredObat = medicines.filter((obat) => {
    const namaKategori = obat.category_name || obat.categoryName || ""; 
    const matchesCategory = selectedCategory === "Semua" ||  
      namaKategori.toLowerCase() === selectedCategory.toLowerCase(); 

    const namaObat = obat.name || "";
    const deskripsiObat = obat.description || "";
    const matchesSearch = namaObat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deskripsiObat.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  }); 

  return (
    <div style={{ backgroundColor: "#f8fafb", minHeight: "100vh" }}> 
      
      {/* 🔑 FIX ABSOLUT: Mematikan paksa search bar CSS Modules bawaan Hero kelompok agar lenyap total */}
      <style>{`
        /* Menghapus pembungkus search bar bawaan Hero */
        div[class*="_search_container_"] {
          display: none !important;
        }
        
        /* Menghapus deretan tombol rekomendasi hashtag di bawahnya (#VitaminC, #ObatFlu, dll) */
        div[class*="_search_container_"] + div {
          display: none !important;
        }

        /* 🛡️ PENGAMAN: Pastikan search bar premium milikmu tetap muncul normal */
        .live-search-container,
        .live-search-container * {
          display: flex !important;
        }
        .live-search-container input {
          display: block !important;
        }
        .live-search-container button {
          display: inline-block !important;
        }
      `}</style>

      {/* ===== HERO SECTION ORIGINAL ===== */}
      <Hero /> 

      {/* ===== 🔍 LIVE PREMIUM SEARCH BAR (SATU-SATUNYA) ===== */}
      <div className="live-search-container" style={{ maxWidth: "1200px", margin: "-2rem auto 0 auto", padding: "0 2rem", position: "relative", zIndex: 10 }}> 
        <div style={{ 
          backgroundColor: "#ffffff", 
          padding: "1.4rem", 
          borderRadius: "20px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)", 
          border: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <span style={{ fontSize: "1.5rem", color: "#64748b" }}>🔍</span>
          <div style={{ flex: 1, position: "relative", display: "block" }}>
            <input
              type="text"
              placeholder="Cari obat pilihanmu disini... (Contoh: Paracetamol, Amoxicillin, Vitamin)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                fontWeight: "600",
                color: "#1e293b",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
                display: "block"
              }}
              onFocus={(e) => e.target.style.borderColor = "#0fa968"}
              onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", border: "none", backgroundColor: "transparent", fontSize: "16px", color: "#94a3b8", cursor: "pointer", fontWeight: "700" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== KATEGORI POPULER ===== */}
      <div style={{ maxWidth: "1200px", margin: "3.5rem auto 0 auto", padding: "0 2rem" }}> 
        <div style={{ marginBottom: "1.5rem" }}> 
          <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0fa968", letterSpacing: "1px", textTransform: "uppercase" }}> 
            Kategori Pilihan
          </span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f172a", margin: "4px 0 0 0" }}> 
            Cari Berdasarkan Kategori Medis
          </h2>
        </div>

        {/* Kategori Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}> 
          {categories.map((cat) => { 
            const isActive = selectedCategory === cat.name; 
            return (
              <button
                key={cat.id} 
                type="button" 
                onClick={() => {
                  setSelectedCategory(cat.name); 
                  setSearchQuery(""); 
                }}
                style={{
                  padding: "1.2rem 0.8rem", 
                  backgroundColor: isActive ? "#0fa968" : "#ffffff", 
                  color: isActive ? "#ffffff" : "#0f172a", 
                  border: isActive ? "2px solid #0fa968" : "2px solid #e2e8f0", 
                  borderRadius: "16px", 
                  fontWeight: "700", 
                  fontSize: "0.85rem",
                  cursor: "pointer", 
                  transition: "all 0.2s ease", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  gap: "8px", 
                  boxShadow: isActive ? "0 8px 20px rgba(15,169,104,0.2)" : "0 2px 5px rgba(0,0,0,0.03)" 
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "#0fa968"; e.currentTarget.style.color = "#0fa968"; } }} 
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; } }} 
              >
                <span style={{ fontSize: "1.8rem" }}>{cat.icon}</span> 
                <span style={{ textAlign: "center", lineHeight: 1.3 }}>{cat.name}</span> 
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== KATALOG PRODUK UTAMA ===== */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 4rem auto", padding: "0 2rem" }}> 
        <div style={{ 
          backgroundColor: "#ffffff", 
          borderRadius: "20px", 
          padding: "2rem", 
          border: "1px solid #e2e8f0", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)" 
        }}>
          {/* Header Katalog Info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}> 
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: 0 }}> 
                🌿 Daftar Katalog Obat Riil
              </h2>
              <p style={{ margin: "6px 0 0 0", fontSize: "0.88rem", color: "#64748b" }}> 
                Filter Kategori: <strong style={{ color: "#0fa968" }}>{selectedCategory}</strong> 
                {searchQuery && <span> · Kata Kunci: <strong style={{ color: "#0fa968" }}>"{searchQuery}"</strong></span>}
                {!loading && !error && ` · Ditemukan ${filteredObat.length} item`} 
              </p>
            </div>
            {!loading && !error && filteredObat.length > 0 && ( 
              <span style={{ 
                fontSize: "0.82rem", color: "#0fa968", fontWeight: "700", 
                backgroundColor: "#f0fdf4", padding: "6px 14px", 
                borderRadius: "100px", border: "1px solid #d1fae5" 
              }}>
                ● {filteredObat.length} Produk Medis Siap Sedia
              </span>
            )}
          </div>

          {loading && ( 
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}> 
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div> 
              <p style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: "600" }}> 
                Sedang mengunduh stok obat teranyar dari server Express...
              </p>
            </div>
          )}

          {error && ( 
            <div style={{ textAlign: "center", padding: "2.5rem", color: "#ef4444", backgroundColor: "#fee2e2", borderRadius: "12px" }}> 
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</div> 
              <p style={{ fontWeight: "700", margin: "0 0 6px 0" }}>Eror Pengambilan Data: {error}</p> 
              <span style={{ fontSize: "0.88rem", color: "#64748b" }}>Pastikan server XAMPP MySQL dan file server Express.js kamu sudah running!</span> 
            </div>
          )}

          {!loading && !error && filteredObat.length === 0 && ( 
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#64748b" }}> 
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍❌</div>
              <p style={{ fontWeight: "700", fontSize: "1rem", color: "#0f172a", margin: "0 0 6px 0" }}>Obat Tidak Ditemukan</p> 
              <p style={{ margin: 0, fontSize: "0.88rem" }}>Tidak ada kecocokan nama obat ataupun deskripsi di kategori ini.</p> 
            </div>
          )}

          {!loading && !error && filteredObat.length > 0 && ( 
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}> 
              {filteredObat.map((obat) => ( 
                <MedicineCard 
                  key={obat.id || obat.medicine_id} 
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