const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { sendError } = require("../utils/errorHandler");

class OrderController {
  // FITUR: Checkout Otomatis (CPO Version 🚀)
  store(req, res) {
    const { user_id } = req.body; // Cukup minta user_id

    if (!user_id) return sendError(res, "User ID harus ada!", 400);

    // 1. Ambil data keranjang dari database
    Cart.getByUser(user_id, (err, cartItems) => {
      if (err) return sendError(res, err, 500, "Gagal ambil keranjang");
      if (cartItems.length === 0) return sendError(res, "Keranjang kosong!", 400);

      // 2. Hitung total harga otomatis
      const total_price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // 3. Simpan ke tabel orders
      Order.create({ user_id, total_price }, (err, result) => {
        if (err) return sendError(res, err, 500, "Gagal buat pesanan");
        const orderId = result.insertId;

        // 4. Pindahkan detail barang & Hapus dari keranjang
        cartItems.forEach((item) => {
          Order.createItem({ order_id: orderId, medicine_id: item.id, quantity: item.quantity, price: item.price }, (itemErr) => {
            if (!itemErr) {
              // Setelah sukses dipindah, langsung hapus dari keranjang (Otomatis!)
              Cart.deleteItem(item.id, () => {}); 
            }
          });
        });

        res.status(201).json({
          success: true,
          message: "Checkout Otomatis Berhasil!",
          order_id: orderId,
          total_bayar: total_price
        });
      });
    });
  }
// FITUR: Update Status (Biar rute /orders/:id/status tidak error)
  update(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendError(res, "Status harus diisi", 400);
    }

    Order.updateStatus(id, status, (err, result) => {
      if (err) return sendError(res, err, 500, "Gagal update status");

      if (result.affectedRows === 0) {
        return sendError(res, "Pesanan tidak ditemukan", 404);
      }

      res.json({
        success: true,
        message: "Status pesanan berhasil diperbarui",
      });
    });
  }
  // Riwayat & Update Status tetap sama...
  index(req, res) {
    const { userId } = req.params;
    Order.getByUserId(userId, (err, results) => {
      if (err) return sendError(res, err, 500);
      res.json({ success: true, data: results });
    });
  }
}

module.exports = new OrderController();