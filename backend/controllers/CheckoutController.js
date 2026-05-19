const Checkout = require("../models/Checkout"); // Model baru
const Cart = require("../models/Cart");
const { sendError } = require("../utils/errorHandler");

class CheckoutController {
  // PROSES CHECKOUT
  async store(req, res) {
    const { user_id } = req.body;

    if (!user_id) return sendError(res, "User ID wajib diisi!", 400);

    // 1. Ambil isi keranjang user
    Cart.getByUser(user_id, (err, cartItems) => {
      if (err) return sendError(res, err, 500);
      if (cartItems.length === 0) return sendError(res, "Keranjang kamu masih kosong!", 400);

      // 2. Hitung total harga
      const total_price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // 3. Buat pesanan baru di tabel orders
      Checkout.createOrder({ user_id, total_price }, (err, result) => {
        if (err) return sendError(res, err, 500);
        const orderId = result.insertId;

        // 4. Pindahkan item ke order_items & bersihkan keranjang[cite: 1, 2]
        cartItems.forEach((item) => {
          Checkout.createOrderItem({ 
            order_id: orderId, 
            medicine_id: item.id, 
            quantity: item.quantity, 
            price: item.price 
          }, (itemErr) => {
            if (!itemErr) Cart.deleteItem(item.id, () => {}); 
          });
        });

        res.status(201).json({
          success: true,
          message: "Checkout Berhasil!",
          order_id: orderId,
          total_bayar: total_price
        });
      });
    });
  }
}

module.exports = new CheckoutController();