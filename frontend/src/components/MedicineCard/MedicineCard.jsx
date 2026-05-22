import styles from "./MedicineCard.module.css";

function MedicineCard({ obat, onAddToCart }) {
  return (
    <div className={styles.card}>
      {/* Badge Stok Kontras di Atas Gambar */}
      <span className={styles.stok_badge}>Sisa {obat.stok || 12}</span>
      
      <img src={obat.poster} alt={obat.title} className={styles.image} />
      
      <div className={styles.info_container}>
        <h3 className={styles.title}>{obat.title}</h3>
        <p className={styles.desc}>{obat.desc}</p>
        
        {/* Row Bagian Bawah: Harga di kiri, Tombol di kanan */}
        <div className={styles.action_row}>
          <div className={styles.price_wrapper}>
            <span className={styles.price_label}>Harga</span>
            <span className={styles.price_value}>Rp {obat.price.toLocaleString("id-ID")}</span>
          </div>
          <div className={styles.button_group}>
            <button className={styles.btn_detail}>Detail</button>
            <button className={styles.btn_buy} onClick={() => onAddToCart(obat)}>Beli</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;