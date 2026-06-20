// File: backend/models/Cart.js
const db = require("../config/database"); // Sesuai dengan struktur folder kamu

class Cart {
  // 1. Tambah ke keranjang
  static addItem(data, callback) {
    const sql = "INSERT INTO cart_items (cart_id, medicine_id, quantity) VALUES (?, ?, ?)";
    db.query(sql, [data.cart_id, data.medicine_id, data.quantity], callback);
  }

  // 2. Update jumlah
  static updateQuantity(id, quantity, callback) {
    const sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, id], callback);
  }

  // 3. INI YANG TADI ERROR: Hapus barang
  static deleteItem(id, callback) {
    const sql = "DELETE FROM cart_items WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // 4. Ambil isi keranjang (Kueri buatan Alam - FIXED & SIAP PAKAI FRONTEND)
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

module.exports = Cart; // Pastikan ini ada di paling bawah!