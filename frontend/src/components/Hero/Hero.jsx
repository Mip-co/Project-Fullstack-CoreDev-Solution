import styles from "./Hero.module.css";

function Hero() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.hero_left}>
          <h2 className={styles.hero_title}>
            Beli Obat & Kebutuhan Medis <span className={styles.highlight}>Tanpa Antri.</span>
          </h2>
          <p className={styles.hero_description}>
            Akses cepat ke berbagai macam obat-obatan terpercaya dan layanan konsultasi klinik dalam satu platform.
          </p>

          {/* 🔍 Search Bar dari Tampilan Gambar Mockup */}
          <div className={styles.search_container}>
            <div className={styles.search_input_wrapper}>
              <span className={styles.search_icon}>🔍</span>
              <input 
                type="text" 
                placeholder="Cari obat, vitamin, atau alat kesehatan..." 
                className={styles.search_input}
              />
            </div>
            <button className={styles.search_button}>Cari</button>
          </div>

          {/* 🏷️ Tag Kategori Populer */}
          <div className={styles.tags_container}>
            <span className={styles.tag_item}>#VitaminC</span>
            <span className={styles.tag_item}>#ObatFlu</span>
            <span className={styles.tag_item}>#Masker</span>
          </div>
        </div>

        {/* 💊 Lingkaran Kapsul di Sisi Kanan */}
        <div className={styles.hero_right}>
          <div className={styles.circle_bg}>
            <div className={styles.capsule_shadow}>
              <div className={styles.capsule}>
                <div className={styles.capsule_top}></div>
                <div className={styles.capsule_bottom}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;