// routes/api.js
const express = require("express");
const router = express.Router(); 

// Import Semua Controller (Pola MVC - Pertemuan 3 & 4)
const MedicineController = require("../controllers/MedicineController");
const UserController = require("../controllers/UserController");
const CartController = require("../controllers/CartController");
const OrderController = require("../controllers/OrderController");

// ==========================================
// 1. ENDPOINT MEDICINES (Daftar Obat)
// ==========================================
router.get("/medicines", MedicineController.index);           
router.get("/medicines/:id", MedicineController.show);        
router.post("/medicines", MedicineController.store);          
router.put("/medicines/:id", MedicineController.update);      
router.delete("/medicines/:id", MedicineController.destroy);   

// ==========================================
// 2. ENDPOINT USER (Auth & Profile)
// ==========================================
router.post("/register", UserController.register);      // Register User
router.get("/users/:id", UserController.show);          // Lihat Profil
router.put("/users/:id", UserController.update);        // Update Profil
// ==========================================
// 3. ENDPOINT CART (Keranjang Belanja)
// ==========================================
router.post("/cart", CartController.add);              // Create
router.put("/cart/:id", CartController.update);        // Update
router.get("/cart/user/:userId", CartController.show); // Read

// ==========================================
// 4. ENDPOINT CHECKOUT & ORDERS (Transaksi)
// ==========================================
// Endpoint Order & Checkout
router.post("/checkout", OrderController.store);           // Proses Checkout
router.get("/orders/user/:userId", OrderController.index);    // Lihat Riwayat
router.put("/orders/:id/status", OrderController.update);     // Update Status (Opsional) 

module.exports = router; 