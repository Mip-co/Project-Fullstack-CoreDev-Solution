const express = require("express");
const router = express.Router();

// Controllers
const MedicineController = require("../controllers/MedicineController");
const UserController = require("../controllers/UserController");
const CartController = require("../controllers/CartController");
const OrderController = require("../controllers/OrderController");
const AuthController = require("../controllers/AuthController");

// Middleware
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// ==========================================
// 1. MEDICINES
// ==========================================
router.get("/medicines", MedicineController.index);
router.get("/medicines/:id", MedicineController.show);
router.post("/medicines", MedicineController.store);
router.put("/medicines/:id", MedicineController.update);
router.delete("/medicines/:id", MedicineController.destroy);

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

// ==========================================
// 4. ORDERS & CHECKOUT
// ==========================================
router.post("/checkout", auth, OrderController.store);

// 👉 lebih clean naming
router.get("/orders/user/:userId", auth, OrderController.index);

// 👉 optional: kalau mau endpoint “history”
router.get("/orders/history/:userId", auth, OrderController.index);

router.put("/orders/:id/status", auth, OrderController.update);

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