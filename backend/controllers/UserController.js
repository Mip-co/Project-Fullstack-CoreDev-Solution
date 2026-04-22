const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {

  // ✅ REGISTER (pakai bcrypt)
  async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorHandler(res, "Nama, Email, dan Password wajib diisi!", 400);
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
        if (err) return errorHandler(res, err, 500);
        res.json({
          message: "Register berhasil",
          userId: result.insertId
        });
      });

    } catch (err) {
      return errorHandler(res, err, 500);
    }
  }

  // ✅ LOGIN (pakai bcrypt + JWT)
  login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorHandler(res, "Email dan Password wajib diisi!", 400);
    }

    User.findByEmail(email, async (err, result) => {
      if (err) return errorHandler(res, err, 500);

      if (result.length === 0) {
        return errorHandler(res, "User tidak ditemukan", 404);
      }

      const user = result[0];

      // 🔥 BANDIN HASH PASSWORD
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return errorHandler(res, "Password salah", 400);
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
    });
  }

  // ✅ DETAIL USER
  show(req, res) {
    const { id } = req.params;
    User.findById(id, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      res.json({
        success: true,
        data: result[0]
      });
    });
  }

  // ✅ UPDATE USER
  update(req, res) {
    const { id } = req.params;

    User.update(id, req.body, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      res.json({
        success: true,
        message: "Update berhasil"
      });
    });
  }
}

module.exports = new UserController();