const db = require("../config/database");

class History {
  // Ambil riwayat berdasarkan User ID
  static getByUserId(userId, callback) {
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    db.query(sql, [userId], callback);
  }

  // Ubah status pesanan (misal: 'lunas', 'dikirim')
  static updateStatus(id, status, callback) {
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], callback);
  }
}

module.exports = History;