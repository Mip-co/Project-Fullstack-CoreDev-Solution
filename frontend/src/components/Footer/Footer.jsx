import React from 'react';

function Footer() {
  return (
    <footer style={{ 
      backgroundColor: "#0f172a", 
      color: "#94a3b8", 
      padding: "4rem 2rem 2rem 2rem",
      fontFamily: "inherit",
      borderTop: "1px solid #1e293b",
      marginTop: "5rem"
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "space-between", 
        gap: "3rem",
        marginBottom: "3rem"
      }}>
        {/* Kolom Kiri: Brand & Deskripsi */}
        <div style={{ flex: "1 1 300px" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0fa968", marginBottom: "1rem", margin_top: 0 }}>
            Apotek<span style={{ color: "#ffffff" }}>Now</span>
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#94a3b8" }}>
            Solusi pemesanan obat dan vitamin cepat, aman, dan tepercaya. Integrasi resep digital langsung dari genggaman Anda ke sistem klinik terpadu.
          </p>
        </div>

        {/* Kolom Tengah: Tautan Cepat */}
        <div style={{ flex: "1 1 200px" }}>
          <h4 style={{ color: "#ffffff", fontWeight: "700", marginBottom: "1.2rem", margin_top: 0, fontSize: "1rem" }}>
            Jelajahi
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
            <li><a href="#katalog" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}>Katalog Obat</a></li>
            <li><a href="#keranjang" style={{ color: "#94a3b8", textDecoration: "none" }}>Keranjang Belanja</a></li>
            <li><a href="#dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>Riwayat Transaksi</a></li>
          </ul>
        </div>

        {/* Kolom Kanan: Info Kontak & Jam Ops */}
        <div style={{ flex: "1 1 250px" }}>
          <h4 style={{ color: "#ffffff", fontWeight: "700", marginBottom: "1.2rem", margin_top: 0, fontSize: "1rem" }}>
            Kontak & Bantuan
          </h4>
          <p style={{ fontSize: "0.9rem", margin: "0 0 10px 0" }}>📍 Depok, Indonesia</p>
          <p style={{ fontSize: "0.9rem", margin: "0 0 10px 0" }}>📞 24-Hour Hotline: (021) 888-999</p>
          <p style={{ fontSize: "0.9rem", margin: 0 }}>🕒 Jam Operasional: Jam 07.00 - 22.00 WIB</p>
        </div>
      </div>

      {/* Bagian Bawah: Hak Cipta */}
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        paddingTop: "2rem", 
        borderTop: "1px solid #1e293b", 
        textAlign: "center",
        fontSize: "0.85rem"
      }}>
        <p style={{ margin: 0 }}>
          © 2026 <strong>ApotekNow</strong> Kelompok CoreDev Solution.
        </p>
        <span style={{ color: "#64748b", display: "block", marginTop: "4px", fontSize: "0.75rem" }}>
          Dikembangkan menggunakan React.js + Vite & Express MySQL untuk Tugas Besar Fullstack Project.
        </span>
      </div>
    </footer>
  );
}

export default Footer;