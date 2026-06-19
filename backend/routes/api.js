const express = require("express");
const router = express.Router();

// 🔑 FIX CASE-SENSITIVE LINUX: Menggunakan huruf kecil sesuai nama file asli 'authController.js'
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
router.get("/users/:id", auth, UserController.show);
router.put("/users/:id", auth, UserController.update);
router.get("/profile", auth, (req, res) => res.json({ success: true, user: req.user }));

// --- ENDPOINT PROFILE IMAGE (AMAYA FEATURE) ---
router.put("/profile/image", auth, upload.single("photo"), AuthController.updateProfileImage);

// --- ENDPOINT CART (KERANJANG) ---
router.post("/cart", auth, CartController.add);
router.put("/cart/:id", auth, CartController.update);
router.get("/cart/user/:userId", auth, CartController.show);
router.delete("/cart/:id", auth, CartController.delete);

// --- ENDPOINT CHECKOUT & HISTORY ---
router.post("/checkout", auth, CheckoutController.store);
router.get("/orders/user/:userId", auth, HistoryController.index);
router.get("/orders/history/:userId", auth, HistoryController.index);
router.put("/orders/:id/status", auth, HistoryController.update);

module.exports = router;