const db = require("../config/database");

class Medicine {
  static getAll(callback) {
    db.query("SELECT * FROM medicines", callback);
  }

  static getById(id, callback) {
    db.query("SELECT * FROM medicines WHERE id = ?", [id], callback);
  }

  static create(data, callback) {
    const sql = "INSERT INTO medicines (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [data.name, data.description, data.price, data.stock, data.category_id], callback);
  }

  static update(id, data, callback) {
    const sql = "UPDATE medicines SET name=?, description=?, price=?, stock=?, category_id=? WHERE id=?";
    db.query(sql, [data.name, data.description, data.price, data.stock, data.category_id, id], callback);
  }

  static delete(id, callback) {
    db.query("DELETE FROM medicines WHERE id = ?", [id], callback);
  }
}

module.exports = Medicine;