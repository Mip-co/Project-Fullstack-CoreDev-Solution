const Cart = require("../models/Cart");
const errorHandler = require("../utils/errorHandler");

class CartController {
  // CREATE (Tambah ke Keranjang)
  add(req, res) {
    const { cart_id, medicine_id, quantity } = req.body;

    // VALIDASI: Cek apakah input kosong atau quantity minus
    if (!cart_id || !medicine_id || !quantity) {
      return errorHandler(res, "Data tidak lengkap!", 400);
    }
    if (quantity < 1) {
      return errorHandler(res, "Jumlah barang minimal 1", 400);
    }

    Cart.addItem({ cart_id, medicine_id, quantity }, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal tambah ke keranjang");
      res.status(201).json({ success: true, message: "Berhasil masuk keranjang" });
    });
  }

  // UPDATE (Ubah Quantity)
  update(req, res) {
    const { id } = req.params; // ID dari cart_items
    const { quantity } = req.body;

    // VALIDASI: Cek input
    if (!quantity || quantity < 1) {
      return errorHandler(res, "Jumlah tidak valid", 400);
    }

    Cart.updateQuantity(id, quantity, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal update keranjang");
      
      // ERROR HANDLING: Jika ID cart_item tidak ditemukan
      if (result.affectedRows === 0) {
        return errorHandler(res, "Item keranjang tidak ditemukan", 404);
      }

      res.json({ success: true, message: "Jumlah barang berhasil diubah" });
    });
  }

  // GET (Lihat Keranjang)
  show(req, res) {
    const { userId } = req.params;
    Cart.getByUser(userId, (err, results) => {
      if (err) return errorHandler(res, err, 500);
      res.json({ success: true, data: results });
    });
  }
}

module.exports = new CartController();