const db = require("../config/database");

class Checkout {
  // Simpan header pesanan (orders)
  static createOrder(data, callback) {
    const sql = "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')";
    db.query(sql, [data.user_id, data.total_price], callback);
  }

  // 🔑 FIX MUTLAK: Simpan detail item SEKALIGUS potong stok obat otomatis di MySQL
  static createOrderItem(data, callback) {
    const sqlInsertItem = "INSERT INTO order_items (order_id, medicine_id, quantity, price) VALUES (?, ?, ?, ?)";
    
    db.query(sqlInsertItem, [data.order_id, data.medicine_id, data.quantity, data.price], (err, result) => {
      if (err) return callback(err, null);

      // 🔄 Kueri Pengurang Stok Otomatis Berdasarkan Jumlah yang Dibeli User
      const sqlUpdateStock = "UPDATE medicines SET stock = stock - ? WHERE id = ?";
      db.query(sqlUpdateStock, [data.quantity, data.medicine_id], (stockErr) => {
        if (stockErr) return callback(stockErr, null);
        
        callback(null, result);
      });
    });
  }
}

module.exports = Checkout;