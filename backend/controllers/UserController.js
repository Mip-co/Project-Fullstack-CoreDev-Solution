const User = require("../models/User");
const { sendError } = require("../utils/errorHandler"); // ✅ Kita pakai sendError
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class UserController {

  // ✅ REGISTER (pakai bcrypt)
  async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, "Nama, Email, dan Password wajib diisi!", 400);
    }

    try {
      // 🔥 HASH PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);

      const data = {
        ...req.body,
        password: hashedPassword,
        role: "user" // default role
      };

      User.create(data, (err, result) => {
        if (err) return sendError(res, err, 500);
        res.json({
          success: true,
          message: "Register berhasil",
          userId: result.insertId
        });
      });

    } catch (err) {
      return sendError(res, err, 500);
    }
  }

  // ✅ LOGIN (pakai bcrypt + JWT)
  login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email dan Password wajib diisi!", 400);
    }

    User.findByEmail(email, async (err, result) => {
      if (err) return sendError(res, err, 500);

      if (result.length === 0) {
        return sendError(res, "User tidak ditemukan", 404);
      }

      const user = result[0];

      try {
        // 🔥 BANDINGKAN HASH PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return sendError(res, "Password salah", 400);
        }

        // 🔐 JWT
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.json({
          success: true,
          message: "Login berhasil",
          token
        });
      } catch (err) {
        return sendError(res, err, 500);
      }
    });
  }

  // ✅ DETAIL USER
  show(req, res) {
    const { id } = req.params;
    User.findById(id, (err, result) => {
      if (err) return sendError(res, err, 500);
      if (!result || result.length === 0) return sendError(res, "User tidak ditemukan", 404);
      
      res.json({
        success: true,
        data: result[0]
      });
    });
  }

  // ✅ UPDATE USER
  update(req, res) {
    const { id } = req.params;

    // Jika ada update foto profil dari Multer
    const data = {
      ...req.body,
      ...(req.file && { profile_picture: req.file.filename })
    };

    User.update(id, data, (err, result) => {
      if (err) return sendError(res, err, 500);
      res.json({
        success: true,
        message: "Update berhasil"
      });
    });
  }
}

module.exports = new UserController();