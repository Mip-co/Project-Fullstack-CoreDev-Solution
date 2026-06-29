const db = require("../config/database");

const User = {
  // Ambil user berdasarkan ID
  findById: (id, callback) => {
    const query = "SELECT id, name, email, phone, address, role, profile_picture, created_at FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  // Ambil user berdasarkan email untuk login
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  // Ambil SEMUA user untuk Admin Dashboard
  getAll: (callback) => {
    const query = "SELECT id, name, email, phone, address, role, profile_picture, created_at FROM users ORDER BY created_at DESC";
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  },

  // Pendaftaran akun baru
  create: (data, callback) => {
    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')";
    db.query(query, [data.name, data.email, data.password], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results.insertId);
    });
  },

  // 🔑 FIX JITU: Update profil/role aman tanpa menghapus field lain jika bernilai undefined
  update: (id, data, callback) => {
    // Tarik data lama terlebih dahulu dari MySQL agar field yang tidak dikirim tidak menjadi NULL
    User.findById(id, (err, oldUser) => {
      if (err) return callback(err, null);
      if (!oldUser) return callback(new Error("User tidak ditemukan"), null);

      const finalName = data.name !== undefined ? data.name : oldUser.name;
      const finalPhone = data.phone !== undefined ? data.phone : oldUser.phone;
      const finalAddress = data.address !== undefined ? data.address : oldUser.address;
      const finalRole = data.role !== undefined ? data.role : oldUser.role;

      const query = "UPDATE users SET name = ?, phone = ?, address = ?, role = ? WHERE id = ?";
      db.query(query, [finalName, finalPhone, finalAddress, finalRole, id], callback);
    });
  },

  // 🔑 FITUR BARU: Hapus Akun Berantai (Cascade Delete manual via SQL Transaction)
  deleteCascade: (id, callback) => {
    db.beginTransaction((err) => {
      if (err) return callback(err, null);

      // A. Hapus semua item di keranjang (cart_items) milik user ini
      const deleteCartItems = `
        DELETE ci FROM cart_items ci 
        INNER JOIN carts c ON ci.cart_id = c.id 
        WHERE c.user_id = ?`;
      
      db.query(deleteCartItems, [id], (err) => {
        if (err) return db.rollback(() => callback(err, null));

        // B. Hapus keranjang (carts) milik user
        db.query("DELETE FROM carts WHERE user_id = ?", [id], (err) => {
          if (err) return db.rollback(() => callback(err, null));

          // C. Hapus semua detail item pesanan (order_items) milik user ini
          const deleteOrderItems = `
            DELETE oi FROM order_items oi 
            INNER JOIN orders o ON oi.order_id = o.id 
            WHERE o.user_id = ?`;
          
          db.query(deleteOrderItems, [id], (err) => {
            if (err) return db.rollback(() => callback(err, null));

            // D. Hapus nota induk pesanan (orders) milik user
            db.query("DELETE FROM orders WHERE user_id = ?", [id], (err) => {
              if (err) return db.rollback(() => callback(err, null));

              // E. Terakhir, hapus entitas utama akun user
              db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
                if (err) return db.rollback(() => callback(err, null));

                // Commit seluruh transaksi jika tidak ada error berkait
                db.commit((err) => {
                  if (err) return db.rollback(() => callback(err, null));
                  callback(null, true);
                });
              });
            });
          });
        });
      });
    });
  },

  // Update foto profil
  updateProfileImage: (id, filename, callback) => {
    const query = "UPDATE users SET profile_picture = ? WHERE id = ?";
    db.query(query, [filename, id], callback);
  }
};

module.exports = User;