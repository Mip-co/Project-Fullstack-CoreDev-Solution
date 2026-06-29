const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");
const UserController = require("../controllers/UserController");
const MedicineController = require("../controllers/MedicineController");
const CartController = require("../controllers/CartController");
const CheckoutController = require("../controllers/CheckoutController");
const HistoryController = require("../controllers/HistoryController");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// --- ENDPOINT MEDICINES (OBAT) ---
router.get("/medicines", MedicineController.index);
router.get("/medicines/:id", MedicineController.show);
router.post("/medicines", auth, upload.single("image"), MedicineController.store);
router.put("/medicines/:id", auth, upload.single("image"), MedicineController.update);
router.delete("/medicines/:id", auth, MedicineController.destroy);

// --- ENDPOINT AUTHENTICATION ---
router.post("/login", UserController.login);
router.post("/register", UserController.register);

// [FIX #1] Route GET /users (semua user) HARUS didaftarkan SEBELUM /users/:id
// agar Express tidak salah mengira "users" sebagai nilai :id
router.get("/users", auth, UserController.index);        // ← BARU: untuk AdminDashboard
router.get("/users/:id", auth, UserController.show);
router.put("/users/:id", auth, UserController.update);
router.delete("/users/:id", auth, UserController.destroy);
router.get("/profile", auth, (req, res) => res.json({ success: true, user: req.user }));

// --- ENDPOINT PROFILE IMAGE ---
router.put("/profile/image", auth, upload.single("photo"), AuthController.updateProfileImage);

// --- ENDPOINT CART (KERANJANG) ---
router.post("/cart", auth, CartController.add);
router.put("/cart/:id", auth, CartController.update);
router.get("/cart/user/:userId", auth, CartController.show);
router.delete("/cart/:id", auth, CartController.delete);

// --- ENDPOINT CHECKOUT & HISTORY ---
router.post("/checkout", auth, CheckoutController.store);

// [FIX #2] Route GET /orders (semua order) HARUS didaftarkan SEBELUM /orders/:id/status
// agar Express tidak bentrok dengan route lain yang memakai parameter
router.get("/orders", auth, HistoryController.indexAll);          // ← BARU: untuk AdminDashboard
router.get("/orders/user/:userId", auth, HistoryController.index);
router.get("/orders/history/:userId", auth, HistoryController.index);
router.put("/orders/:id/status", auth, HistoryController.update);

module.exports = router;
