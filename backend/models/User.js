const db = require("../config/database");

class User {
  // CREATE: Tambah user baru (Register)
  static create(data, callback) {
    const sql = "INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [data.name, data.email, data.password, data.phone, data.address], callback);
  }

  // READ: Ambil satu user (untuk login/detail)
  static findById(id, callback) {
    const sql = "SELECT id, name, email, phone, address FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // UPDATE: Ubah data user
  static update(id, data, callback) {
    const sql = "UPDATE users SET name=?, email=?, phone=?, address=? WHERE id=?";
    db.query(sql, [data.name, data.email, data.phone, data.address, id], callback);
  }
}

module.exports = User;