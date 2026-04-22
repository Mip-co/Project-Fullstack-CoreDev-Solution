const Order = require("../models/Order");
const errorHandler = require("../utils/errorHandler");

class OrderController {
  // FITUR: Checkout (Proses beli)
  store(req, res) {
    const { user_id, total_price, items } = req.body;

    // VALIDASI Sprint 5: Cek kelengkapan & tipe data
    if (!user_id || !total_price || !items) {
      return errorHandler(res, "Data checkout tidak lengkap (user_id/total_price/items)", 400);
    }
    if (!Array.isArray(items) || items.length === 0) {
      return errorHandler(res, "Item belanja tidak boleh kosong dan harus berupa array!", 400);
    }

    // 1. Simpan ke tabel orders
    Order.create({ user_id, total_price }, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal membuat pesanan");

      const orderId = result.insertId;

      // 2. Simpan setiap item ke order_items
      items.forEach((item) => {
        Order.createItem({ order_id: orderId, ...item }, (itemErr) => {
          if (itemErr) console.error("Gagal simpan item detail:", itemErr);
        });
      });

      res.status(201).json({
        success: true,
        message: "Checkout berhasil, pesanan sedang diproses",
        order_id: orderId
      });
    });
  }

  // FITUR: Riwayat Pesanan
  index(req, res) {
    const { userId } = req.params;

    Order.getByUserId(userId, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil riwayat");
      
      if (results.length === 0) {
        return errorHandler(res, "User belum memiliki riwayat pesanan", 404);
      }

      res.json({
        success: true,
        message: "Berhasil mengambil riwayat pesanan",
        data: results
      });
    });
  }

  // FITUR: Update Status (Misal untuk Admin)
  update(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return errorHandler(res, "Status harus diisi", 400);

    Order.updateStatus(id, status, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      if (result.affectedRows === 0) return errorHandler(res, "Pesanan tidak ditemukan", 404);
      
      res.json({ success: true, message: "Status pesanan diperbarui" });
    });
  }
}

module.exports = new OrderController();