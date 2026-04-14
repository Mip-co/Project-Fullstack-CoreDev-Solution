const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

class UserController {
  // FITUR: Register (Create User)
  register(req, res) {
    const { name, email, password } = req.body;

    // VALIDASI Sprint 5: Required Fields
    if (!name || !email || !password) {
      return errorHandler(res, "Nama, Email, dan Password wajib diisi!", 400);
    }

    // VALIDASI: Cek format email sederhana
    if (!email.includes("@")) {
      return errorHandler(res, "Format email tidak valid!", 400);
    }

    User.create(req.body, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal mendaftarkan user (Email mungkin sudah terdaftar)");
      res.status(201).json({ 
        success: true, 
        message: "User berhasil didaftarkan",
        userId: result.insertId 
      });
    });
  }

  // FITUR: Update Profil
  update(req, res) {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    // VALIDASI Sprint 5
    if (!name || !email) {
      return errorHandler(res, "Nama dan Email tidak boleh kosong saat update", 400);
    }

    User.update(id, req.body, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal memperbarui data user");
      
      if (result.affectedRows === 0) {
        return errorHandler(res, "User tidak ditemukan", 404);
      }

      res.json({ success: true, message: "Profil berhasil diperbarui" });
    });
  }

  // FITUR: Detail User
  show(req, res) {
    const { id } = req.params;
    User.findById(id, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      if (result.length === 0) return errorHandler(res, "User tidak ditemukan", 404);
      res.json({ success: true, data: result[0] });
    });
  }
}

module.exports = new UserController();