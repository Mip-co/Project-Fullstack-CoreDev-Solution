const db = require("../config/database");

class Order {
  // CREATE: Simpan header pesanan
  static create(data, callback) {
    const sql = "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')";
    db.query(sql, [data.user_id, data.total_price], callback);
  }

  // CREATE: Simpan detail item pesanan
  static createItem(data, callback) {
    const sql = "INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)";
    db.query(sql, [data.order_id, data.medicine_id, data.quantity, data.price], callback);
  }

  // READ: Ambil riwayat berdasarkan User ID
  static getByUserId(userId, callback) {
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    db.query(sql, [userId], callback);
  }

  // UPDATE: Ubah status pesanan (misal: 'lunas', 'dikirim')
  static updateStatus(id, status, callback) {
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], callback);
  }
}

module.exports = Order;