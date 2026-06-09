import { useState, useEffect } from "react";//  Kodingan yang benar dan presisi:
import { getMedicines } from "../utils/api/medicineApi";
import MedicineCard from "../components/MedicineCard/MedicineCard";
import Hero from "../components/Hero/Hero";

function Home({ onAddToCart }) {
  // State manajemen data sesuai materi halaman 43
  const [medicines, setMedicines] = useState([]); // Menampung array data obat dari MySQL
  const [loading, setLoading] = useState(true);   // Status loading data
  const [error, setError] = useState(null);       // Status penampung pesan error jika backend mati
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = [
    { id: "all", name: "Semua" },
    { id: "cat-01", name: "Vitamin" },
    { id: "cat-02", name: "Obat Flu" },
    { id: "cat-03", name: "P3K" },
    { id: "cat-04", name: "Masker" }
  ];

  // 🔄 Memicu Lifecycle Mount untuk mengambil data dari server (Halaman 16 & 43)
  useEffect(() => {
    async function fetchMedicineData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getMedicines(); // Menembak API Express backend
        // Sesuaikan target array-nya (misal response.data atau response.data.data tergantung struktur Express-mu)
        setMedicines(response.data.data || response.data); 
      } catch (err) {
        setError(err.message || "Gagal memuat data dari server backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchMedicineData();
  }, []); // Array kosong memastikan kueri hanya ditembak SEKALI saat halaman dimuat (Halaman 20)

  // Logika Filter Kategori (Membaca kolom categoryName hasil kueri tabel database asli kamu)
  const filteredObat = selectedCategory === "Semua" 
    ? medicines 
    : medicines.filter((obat) => obat.categoryName === selectedCategory);

  return (
    <div>
      <Hero />

      <div style={{ maxWidth: "1200px", margin: "4rem auto 2rem auto", padding: "0 2rem" }}>
        
        {/* Kategori Slider Filter */}
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
                    transition: "all 0.2s ease"
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seksi Tampilan Katalog Utama */}
        <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              🌿 Produk Kesehatan ({selectedCategory})
            </h2>
          </div>
          
          {/* ⏳ Kondisional Render sesuai Panduan Materi Halaman 43 */}
          {loading && (
            <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
              🔄 Sedang menarik data dari database ApotekNow...
            </p>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444", backgroundColor: "#fee2e2", borderRadius: "12px" }}>
              ⚠️ Eror: {error}. <br />
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Pastikan server XAMPP MySQL dan Express.js kamu sudah dinyalakan!</span>
            </div>
          )}

          {!loading && !error && filteredObat.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              Belum ada data stok obat di database untuk kategori ini.
            </div>
          )}

          {!loading && !error && filteredObat.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
              {filteredObat.map((obat) => (
                <MedicineCard 
                  key={obat.id || obat.medicine_id} // Menyesuaikan primary key dari database MySQL kamu
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