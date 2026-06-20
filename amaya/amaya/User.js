const db = require("../config/database"); //

const User = {
  // Ambil user berdasarkan ID untuk keperluan penayangan profil di dashboard
  findById: (id, callback) => {
    const query = "SELECT id, name, email, phone, address, role, profile_picture, created_at FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  // Ambil user berdasarkan email untuk kebutuhan validasi login
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  // Pendaftaran akun pengguna baru ke sistem database
  create: (data, callback) => {
    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
    db.query(query, [data.name, data.email, data.password], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.insertId);
    });
  },

  // Perbaruan data teks profil pengguna
  update: (id, data, callback) => {
    const query = "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?";
    db.query(query, [data.name, data.phone, data.address, id], callback);
  },

  // 🔑 FIX SINKRONISASI KOLOM: Menembak profile_picture, bukan profile_image
  updateProfileImage: (id, filename, callback) => {
    const query = "UPDATE users SET profile_picture = ? WHERE id = ?";
    db.query(query, [filename, id], callback);
  }
};

module.exports = User;