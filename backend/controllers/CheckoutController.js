const Checkout = require("../models/Checkout"); // Model baru
const Cart = require("../models/Cart");
const { sendError } = require("../utils/errorHandler");

class CheckoutController {
  // PROSES CHECKOUT
  async store(req, res) {
    const userId = req.user?.id; // Gunakan user ID yang sudah divalidasi dari token JWT
    const { nama, telepon, alamat, catatan, shippingMethod, total_price, items } = req.body;

    if (!userId) return sendError(res, "Token user tidak valid atau tidak ditemukan.", 401);
    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, "Tidak ada item checkout yang valid.", 400);
    }

    // Validasi sederhana input alamat
    if (!nama || !telepon || !alamat) {
      return sendError(res, "Nama, telepon, dan alamat wajib diisi.", 400);
    }

    const orderTotal = Number(total_price) || items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0);

    // 1. Buat pesanan baru di tabel orders
    Checkout.createOrder({ user_id: userId, total_price: orderTotal }, (err, result) => {
      if (err) return sendError(res, err, 500);
      const orderId = result.insertId;

      // 2. Simpan semua order item yang dikirim dari frontend
      let savedCount = 0;
      let responded = false;

      items.forEach((item) => {
        const medicineId = item.medicine_id || item.id;
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;

        Checkout.createOrderItem({ order_id: orderId, medicine_id: medicineId, quantity, price }, (itemErr) => {
          if (responded) return;
          if (itemErr) {
            responded = true;
            return sendError(res, itemErr, 500);
          }

          savedCount += 1;
          if (savedCount === items.length) {
            responded = true;
            return res.status(201).json({
              success: true,
              message: "Checkout berhasil diproses.",
              order_id: orderId,
              total_bayar: orderTotal
            });
          }
        });
      });
    });
  }
}

module.exports = new CheckoutController();