// File: backend/models/Cart.js
const db = require("../config/database");

class Cart {
  // 🔑 FIX MUTLAK: Otomatis membuatkan baris induk di tabel carts jika user_id/cart_id belum terdaftar
  static addItem(data, callback) {
    // 1. Jalankan kueri INSERT IGNORE ke tabel induk 'carts' terlebih dahulu
    // Menggunakan IGNORE agar jika ID sudah ada, MySQL tidak melemparkan eror dan langsung lanjut
    const sqlInsertCart = "INSERT IGNORE INTO carts (id, user_id) VALUES (?, ?)";
    
    db.query(sqlInsertCart, [data.cart_id, data.cart_id], (err) => {
      if (err) return callback(err, null);

      // 2. Setelah dipastikan rumah/induk keranjangnya ada, baru masukkan item obat ke cart_items
      const sqlInsertItem = "INSERT INTO cart_items (cart_id, medicine_id, quantity) VALUES (?, ?, ?)";
      db.query(sqlInsertItem, [data.cart_id, data.medicine_id, data.quantity], callback);
    });
  }

  // 2. Update jumlah item
  static updateQuantity(id, quantity, callback) {
    const sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, id], callback);
  }

  // 3. Hapus barang dari keranjang
  static deleteItem(id, callback) {
    const sql = "DELETE FROM cart_items WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // 4. Ambil isi keranjang berdasarkan User ID
  static getByUser(userId, callback) {
    const sql = `
      SELECT ci.id, m.id AS medicine_id, m.name, m.price, m.image, m.description, ci.quantity 
      FROM cart_items ci 
      JOIN medicines m ON ci.medicine_id = m.id 
      JOIN carts c ON ci.cart_id = c.id 
      WHERE c.user_id = ?`;
    db.query(sql, [userId], callback);
  }
}

module.exports = Cart;