import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© 2026 ApotekApp Kelompok CoreDev Solution. Hak Cipta Dilindungi Undang-Undang.</p>
        <p style={{ marginTop: "5px", fontSize: "0.85rem", color: "#94a3b8" }}>
          Dikembangkan menggunakan React.js + Vite untuk Final Project Fullstack
        </p>
      </div>
    </footer>
  );
}

export default Footer;