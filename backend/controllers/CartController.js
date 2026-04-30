// Di dalam file backend/controllers/CartController.js
const Cart = require("../models/Cart");
const { sendError } = require("../utils/errorHandler");

class CartController {
  // CREATE (Tambah ke Keranjang)
  add(req, res) {
    const { cart_id, medicine_id, quantity } = req.body;
    if (!cart_id || !medicine_id || !quantity) return sendError(res, "Data tidak lengkap!", 400);
    
    Cart.addItem({ cart_id, medicine_id, quantity }, (err, results) => {
      if (err) return sendError(res, err, 500, "Gagal tambah");
      res.status(201).json({ success: true, message: "Berhasil masuk keranjang" });
    });
  }

  // UPDATE (Ubah Quantity)
  update(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;
    Cart.updateQuantity(id, quantity, (err, result) => {
      if (err) return sendError(res, err, 500);
      res.json({ success: true, message: "Jumlah barang berhasil diubah" });
    });
  }

  // DELETE (INI YANG TADI ERROR: Menghubungkan ke Model deleteItem)
  delete(req, res) {
    const { id } = req.params;
    Cart.deleteItem(id, (err, result) => {
      if (err) return sendError(res, err, 500, "Gagal hapus keranjang");
      if (result.affectedRows === 0) return sendError(res, "Item tidak ditemukan", 404);
      
      res.json({
        success: true,
        message: "Barang berhasil dihapus dari keranjang",
      });
    });
  }

  // GET (Lihat Keranjang)
  show(req, res) {
    const { userId } = req.params;
    Cart.getByUser(userId, (err, results) => {
      if (err) return sendError(res, err, 500);
      res.json({ success: true, data: results });
    });
  }
}

module.exports = new CartController();