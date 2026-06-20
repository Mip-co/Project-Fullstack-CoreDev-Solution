const Cart = require("../models/Cart"); //
const { sendError } = require("../utils/errorHandler"); // 🔑 FIX: Import helper yang benar

const CartController = {
  // 1. Menambahkan item obat ke dalam keranjang belanja database
  add: (req, res) => {
    const { cart_id, medicine_id, quantity } = req.body;

    if (!cart_id || !medicine_id || !quantity || quantity < 1) {
      return sendError(res, new Error("Data input tidak lengkap atau kuantitas tidak valid."), 400, "Gagal menambahkan ke keranjang."); //
    }

    Cart.addItem({ cart_id, medicine_id, quantity }, (err, result) => {
      if (err) {
        return sendError(res, err, 500, "Gagal menyimpan item ke database."); //
      }
      res.json({ success: true, message: "Item berhasil dimasukkan ke keranjang database.", insertId: result.insertId });
    });
  },

  // 2. TARGET ALAM: Memperbarui jumlah kuantitas obat di database (PUT /api/cart/:id)
  update: (req, res) => {
    const { id } = req.params; // Ini adalah id dari cart_items
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return sendError(res, new Error("Kuantitas harus bernilai minimal 1."), 400, "Gagal memperbarui kuantitas."); //
    }

    Cart.updateQuantity(id, quantity, (err, result) => {
      if (err) {
        return sendError(res, err, 500, "Gagal memperbarui kuantitas di database."); //
      }
      res.json({ success: true, message: "Kuantitas keranjang berhasil diperbarui di MySQL." });
    });
  },

  // 3. Menampilkan isi keranjang belanja milik user tertentu
  show: (req, res) => {
    const { userId } = req.params;

    Cart.getByUser(userId, (err, results) => {
      if (err) {
        return sendError(res, err, 500, "Gagal mengambil data keranjang dari database."); //
      }
      res.json({ success: true, data: results });
    });
  },

  // 4. TARGET ALAM: Menghapus satu baris item obat dari keranjang database (DELETE /api/cart/:id)
  delete: (req, res) => {
    const { id } = req.params; // Ini adalah id dari cart_items

    Cart.deleteItem(id, (err, result) => {
      if (err) {
        return sendError(res, err, 500, "Gagal menghapus item dari database."); //
      }
      res.json({ success: true, message: "Item berhasil dihapus dari keranjang database MySQL." });
    });
  }
};

module.exports = CartController;