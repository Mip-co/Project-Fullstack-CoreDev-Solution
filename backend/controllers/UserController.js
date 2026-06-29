const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/errorHandler");

const UserController = {
  // 1. HANDLER REGISTER USER BARU
  register: (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, new Error("Semua field wajib diisi!"), 400, "Gagal melakukan registrasi.");
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return sendError(res, err, 500, "Gagal memproses enkripsi data.");
      }

      User.create({ name, email, password: hashedPassword }, (err, userId) => {
        if (err) {
          return sendError(res, err, 500, "Email sudah terdaftar atau terjadi kesalahan database.");
        }

        return res.status(201).json({
          success: true,
          message: "Akun berhasil dibuat di database MySQL.",
          userId
        });
      });
    });
  },

  // 2. HANDLER LOGIN
  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, new Error("Email dan password wajib diisi!"), 400, "Gagal masuk ke sistem.");
    }

    User.findByEmail(email, (err, user) => {
      if (err) {
        return sendError(res, err, 500, "Terjadi kesalahan internal pada database server.");
      }

      if (!user) {
        return sendError(res, new Error("Akun tidak terdaftar"), 401, "Email atau password yang Anda masukkan salah.");
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return sendError(res, err, 500, "Gagal melakukan komparasi enkripsi.");
        }

        if (!isMatch) {
          return sendError(res, new Error("Password tidak cocok"), 401, "Email atau password yang Anda masukkan salah.");
        }

        // [FIX #3] Tambahkan 'name' ke payload JWT agar AuthContext bisa membaca nama
        // yang benar tanpa harus hit endpoint /profile lagi
        const token = jwt.sign(
          { id: user.id, name: user.name, email: user.email, role: user.role },
          //                ↑ 'name' sekarang ikut disertakan di payload token
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.json({
          success: true,
          message: "Autentikasi berhasil, selamat datang kembali!",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
            profile_picture: user.profile_picture
          }
        });
      });
    });
  },

  // 3. TAMPILKAN DETAIL USER BERDASARKAN ID
  show: (req, res) => {
    const { id } = req.params;

    User.findById(id, (err, user) => {
      if (err) {
        return sendError(res, err, 500, "Gagal mengambil data pengguna.");
      }
      if (!user) {
        return sendError(res, new Error("User tidak ditemukan"), 404, "Data pengguna tidak tercatat.");
      }
      res.json({
        success: true,
        data: user
      });
    });
  },

  // [FIX BARU] 4. TAMPILKAN SEMUA USER (untuk Admin Dashboard)
  // Dipanggil oleh route: GET /api/users
  index: (req, res) => {
    User.getAll((err, users) => {
      if (err) {
        return sendError(res, err, 500, "Gagal mengambil daftar pengguna.");
      }
      res.json({
        success: true,
        data: users
      });
    });
  },

  // 5. PERBARUI PROFIL USER
  update: (req, res) => {
    const { id } = req.params;
    const { name, phone, address, role } = req.body;

    User.update(id, { name, phone, address, role }, (err, result) => {
      if (err) {
        return sendError(res, err, 500, "Gagal memperbarui profil di database.");
      }
      res.json({
        success: true,
        message: "Informasi profil sukses diperbarui di database MySQL."
      });
    });
  }, // 🔑 WAJIB KASIH TANDA KOMA DI SINI SEBELUM LANJUT KE FUNGSI BERIKUTNYA!

  // 🔑 6. HANDLER BARU: HAPUS AKUN SECARA BERANTAI CASCADE
  destroy: (req, res) => {
    const { id } = req.params;

    User.deleteCascade(id, (err, result) => {
      if (err) {
        return sendError(res, err, 500, "Gagal menghapus data akun berantai dari database.");
      }
      res.json({
        success: true,
        message: "Akun beserta seluruh riwayat pesanan & keranjang sukses dihapus permanen."
      });
    });
  } // 🔑 Jangan kasih tanda koma atau titik koma di sini jika ini fungsi paling terakhir di objek!
};


module.exports = UserController;
