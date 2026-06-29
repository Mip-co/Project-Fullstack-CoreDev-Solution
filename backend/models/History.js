const db = require("../config/database");

const History = {
  // Ambil semua order milik satu user (untuk halaman history user biasa)
  getByUserId: (userId, callback) => {
    const query = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // [FIX BARU] Ambil SEMUA order dari seluruh user (untuk Admin Dashboard)
  // JOIN ke tabel users agar nama pelanggan ikut tampil di panel admin
  getAll: (callback) => {
    const query = `
      SELECT 
        o.id,
        o.user_id,
        o.total_price,
        o.status,
        o.created_at,
        u.name AS user_name,
        u.email AS user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Update status order
  updateStatus: (id, status, callback) => {
    const query = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(query, [status, id], callback);
  }
};

module.exports = History;
