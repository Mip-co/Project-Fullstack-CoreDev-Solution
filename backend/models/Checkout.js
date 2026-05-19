const db = require("../config/database");

class Checkout {
  // Simpan header pesanan (orders)
  static createOrder(data, callback) {
    const sql = "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')";
    db.query(sql, [data.user_id, data.total_price], callback);
  }

  // Simpan detail item (order_items)
  static createOrderItem(data, callback) {
    const sql = "INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)";
    db.query(sql, [data.order_id, data.medicine_id, data.quantity, data.price], callback);
  }
}

module.exports = Checkout;