const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRegister, validateLogin } = require("../utils/authValidator");
const errorHandler = require("../utils/errorHandler");

class AuthController {
  register(req, res) {
    const data = req.body;
    const error = validateRegister(data);

    if (error) {
      return errorHandler(res, error, 400);
    }

    // cek email
    User.findByEmail(data.email, async (err, result) => {
      if (err) return errorHandler(res, err, 500);

      if (result.length > 0) {
        return errorHandler(res, "Email sudah ada", 400);
      }

      const hashed = await bcrypt.hash(data.password, 10);

      const user = {
        name: data.name,
        email: data.email,
        password: hashed,
        phone: data.phone || null,
        address: data.address || null,
        role: data.role || "user"
      };

      User.create(user, (err) => {
        if (err) return errorHandler(res, err, 500);

        res.status(201).json({
          success: true,
          message: "Register Berhasil"
        });
      });
    });
  }

  login(req, res) {
    const data = req.body;
    const error = validateLogin(data);

    if (error) {
      return errorHandler(res, error, 400);
    }

    User.findByEmail(data.email, async (err, result) => {
      if (err) return errorHandler(res, err, 500);

      if (result.length === 0) {
        return errorHandler(res, "Email tidak ditemukan", 404);
      }

      const user = result[0];
      const match = await bcrypt.compare(data.password, user.password);

      if (!match) {
        return errorHandler(res, "Password salah", 401);
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        message: "Login Berhasil",
        token
      });
    });
  }
}

module.exports = new AuthController();