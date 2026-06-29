const db = require("../config/database");

class Medicine {
  // 1. Ambil semua data obat lengkap beserta nama kategori pendampingnya
  static getAll(callback) {
    const sql = `
      SELECT m.*, c.name AS category_name
      FROM medicines m
      LEFT JOIN categories c ON m.category_id = c.id 
    `;
    db.query(sql, callback);
  }

  // 2. Ambil kelompok data obat berdasarkan filter Kategori ID tertentu
  static getByCategory(categoryId, callback) {
    const sql = `
      SELECT m.*, c.name AS category_name
      FROM medicines m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.category_id = ?
    `;
    db.query(sql, [categoryId], callback);
  }

  // 3. Ambil detail satu item obat berdasarkan ID uniknya
  static getById(id, callback) {
    const sql = `
      SELECT m.*, c.name AS category_name
      FROM medicines m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.id = ?
    `;
    db.query(sql, [id], callback);
  }

  // 4. Masukkan data obat baru beserta string nama file gambar hasil upload Multer
  static create(data, callback) {
    const sql = `
      INSERT INTO medicines 
      (name, description, price, stock, category_id, image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.name,
      data.description,
      data.price,
      data.stock,
      data.category_id,
      data.image
    ], callback);
  }

  // 5. Perbarui data komponen obat di database MySQL
  static update(id, data, callback) {
    const sql = `
      UPDATE medicines 
      SET name=?, description=?, price=?, stock=?, category_id=?, image=? 
      WHERE id=?
    `;
    db.query(sql, [
      data.name,
      data.description,
      data.price,
      data.stock,
      data.category_id,
      data.image,
      id
    ], callback);
  }

  // 🔑 6. FIX MUTLAK: Hapus obat aman tanpa terbentur ER_ROW_IS_REFERENCED_2 (Errno 1451)
  static delete(id, callback) {
    // A. Matikan pengecekan foreign key sejenak untuk session request ini
    db.query("SET FOREIGN_KEY_CHECKS = 0", (err) => {
      if (err) return callback(err, null);

      // B. Bersihkan paksa baris obat yang mengunci di tabel anak keranjang belanja (cart_items)
      db.query("DELETE FROM cart_items WHERE medicine_id = ?", [id], (err) => {
        if (err) return callback(err, null);

        // C. Bersihkan paksa baris obat yang mengunci di tabel detail pesanan kuitansi (order_items)
        db.query("DELETE FROM order_items WHERE medicine_id = ?", [id], (err) => {
          if (err) return callback(err, null);

          // D. Hapus produk inti dari tabel utama medicines setelah gerbang relasi bersih
          db.query("DELETE FROM medicines WHERE id = ?", [id], (err) => {
            if (err) return callback(err, null);

            // E. WAJIB! Hidupkan kembali proteksi foreign key demi menjaga keamanan database bersama
            db.query("SET FOREIGN_KEY_CHECKS = 1", (err) => {
              if (err) return callback(err, null);
              
              // Kembalikan status sukses ke controller
              callback(null, true);
            });
          });
        });
      });
    });
  }
}

module.exports = Medicine;