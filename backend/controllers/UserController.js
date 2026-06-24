const User = require("../models/User"); //
const bcrypt = require("bcryptjs"); //
const jwt = require("jsonwebtoken"); //
const { sendError } = require("../utils/errorHandler"); // Menggunakan helper error standar kelompok

const UserController = {
  // 1. HANDLER REGISTER USER BARU
  register: (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, new Error("Semua field wajib diisi!"), 400, "Gagal melakukan registrasi.");
    }

    // Lakukan enkripsi password sebelum disimpan ke database MySQL
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return sendError(res, err, 500, "Gagal memproses enkripsi data.");
      }

      User.create({ name, email, password: hashedPassword }, (err, userId) => {
        if (err) {
          return sendError(res, err, 500, "Email sudah terdaftar atau terjadi kesalahan database.");
        }
        
        // 🔑 FIX: Ubah angka status 21 menjadi 201 (HTTP Status Created)
        return res.status(201).json({
          success: true,
          message: "Akun berhasil dibuat di database MySQL.",
          userId
        });
      });
    });
  },

  // 2. 🔑 FIX BUG LOGIN: Handler Login Anti-Crash
  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, new Error("Email dan password wajib diisi!"), 400, "Gagal masuk ke sistem.");
    }

    // Ambil data user dari database berdasarkan email input
    User.findByEmail(email, (err, user) => {
      if (err) {
        return sendError(res, err, 500, "Terjadi kesalahan internal pada database server.");
      }

      // 🔥 SOLUSI UTAMA: Validasi jika user tidak ditemukan (undefined / null) agar tidak crash!
      if (!user) {
        return sendError(res, new Error("Akun tidak terdaftar"), 401, "Email atau password yang Anda masukkan salah.");
      }

      // Jika user ditemukan, aman untuk membaca user.password tanpa memicu TypeError
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return sendError(res, err, 500, "Gagal melakukan komparasi enkripsi.");
        }

        if (!isMatch) {
          return sendError(res, new Error("Password tidak cocok"), 401, "Email atau password yang Anda masukkan salah.");
        }

        // Jika password cocok, buat token autentikasi JWT
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        // Kirimkan token dan data user minimal ke frontend-nya Silva
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

  // 3. MENAMPILKAN DETAIL USER DATA BERDASARKAN ID
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

  // 4. MEMPERBARUI INFORMASI DATA PROFIL USER
  update: (req, res) => {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    User.update(id, { name, phone, address }, (err, result) => {
      if (err) {
        return sendError(res, err, 500, "Gagal memperbarui profil di database.");
      }
      res.json({
        success: true,
        message: "Informasi profil sukses diperbarui di database MySQL."
      });
    });
  }
};

module.exports = UserController;