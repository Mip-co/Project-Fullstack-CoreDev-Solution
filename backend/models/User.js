const db = require("../config/database");

class User {
  // CREATE: Tambah user baru (Register)
 static create(data, callback) {
  const sql = "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      data.name,
      data.email,
      data.password,
      data.phone,
      data.address,
      data.role || "user"
    ],
    callback
  );
}

  // READ: Ambil satu user (untuk login/detail)
  static findById(id, callback) {
    const sql = "SELECT id, name, email, phone, address, role FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // READ: Cari user berdasarkan email (UNTUK LOGIN)
  static findByEmail(email, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  }

  // UPDATE: Ubah data user
  static update(id, data, callback) {
    const sql = "UPDATE users SET name=?, email=?, phone=?, address=? WHERE id=?";
    db.query(sql, [data.name, data.email, data.phone, data.address, id], callback);
  }
}

module.exports = User;