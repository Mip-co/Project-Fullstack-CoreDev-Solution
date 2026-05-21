const express = require("express");
const router = express.Router();

// Controllers
const MedicineController = require("../controllers/MedicineController");
const UserController = require("../controllers/UserController");
const CartController = require("../controllers/CartController");
const CheckoutController = require("../controllers/CheckoutController"); // Ganti Order ke Checkout 🚀
const HistoryController = require("../controllers/HistoryController");   // Tambah History Controller 🚀
const AuthController = require("../controllers/AuthController");

// Middleware
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// ==========================================
// 1. MEDICINES
// ==========================================
router.get("/medicines", MedicineController.index);
router.get("/medicines/:id", MedicineController.show);

// GANTI BAGIAN INI: Pastikan hanya ada satu POST dan pakai middleware upload
router.post("/medicines", auth, upload.single('image'), MedicineController.store);

// Update juga harus pakai upload kalau mau ganti foto
router.put("/medicines/:id", auth, upload.single('image'), MedicineController.update);

router.delete("/medicines/:id", auth, MedicineController.destroy);


// ==========================================
// 2. AUTH & USER
// ==========================================
router.post("/login", UserController.login);
router.post("/register", UserController.register);

// 🔐 Protected user profile
router.get("/users/:id", auth, UserController.show);
router.put("/users/:id", auth, UserController.update);

// ==========================================
// 3. CART
// ==========================================
router.post("/cart", auth, CartController.add);
router.put("/cart/:id", auth, CartController.update);
router.get("/cart/user/:userId", auth, CartController.show);
router.delete("/cart/:id", auth, CartController.delete);

// ==========================================
// 4. ORDERS & CHECKOUT (Sprint 8 - Split Version)
// ==========================================
// 🛒 Bagian Checkout (Dikerjakan Anggota Tim A)
router.post("/checkout", auth, CheckoutController.store);

// 📜 Bagian Riwayat & Status (Dikerjakan Anggota Tim B)
router.get("/orders/user/:userId", auth, HistoryController.index);
router.get("/orders/history/:userId", auth, HistoryController.index);
router.put("/orders/:id/status", auth, HistoryController.update);

// ==========================================
// 5. PROFILE
// ==========================================
router.get("/profile", auth, (req, res) => {
  res.json({
    success: true,
    message: "Akses berhasil",
    user: req.user,
  });
});

// Upload foto profil
router.put(
  "/profile/image",
  auth,
  upload.single("photo"),
  AuthController.updateProfileImage
);

module.exports = router;