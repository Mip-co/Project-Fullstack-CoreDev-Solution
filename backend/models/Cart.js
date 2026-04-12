const db = require("../config/database");

class Cart {
  // CREATE: Tambah item baru
  static addItem(data, callback) {
    const sql = "INSERT INTO cart_items (cart_id, medicine_id, quantity) VALUES (?, ?, ?)";
    db.query(sql, [data.cart_id, data.medicine_id, data.quantity], callback);
  }

  // UPDATE: Ubah jumlah barang yang sudah ada di keranjang
  static updateQuantity(id, quantity, callback) {
    const sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
    db.query(sql, [quantity, id], callback);
  }

  // Ambil isi keranjang
  static getByUser(userId, callback) {
    const sql = `
      SELECT ci.id, m.name, m.price, ci.quantity 
      FROM cart_items ci 
      JOIN medicines m ON ci.medicine_id = m.id 
      JOIN carts c ON ci.cart_id = c.id 
      WHERE c.user_id = ?`;
    db.query(sql, [userId], callback);
  }
}

module.exports = Cart;