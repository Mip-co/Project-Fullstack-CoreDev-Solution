const db = require("../config/database");

class Medicine {
static getAll(callback) {
  const sql = `
   SELECT m.*, c.name AS category_name
    FROM medicines m
    LEFT JOIN categories c ON m.category_id = c.id 
  `;
  db.query(sql, callback);
}

static getById(id, callback) {
  const sql = `
    SELECT m.*, c.name AS category_name
    FROM medicines m
    LEFT JOIN categories c ON m.category_id = c.id
    WHERE m.id = ?
  `;
  db.query(sql, [id], callback);
}

static create(data, callback) {
  const sql = `
    INSERT INTO medicines 
    (name, description, price, stock, category_id, image) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    data.name,
    data.description,
    data.price,
    data.stock,
    data.category_id,
    data.image // ← add image
  ], callback);
}

static update(id, data, callback) {
  const sql = `
    UPDATE medicines 
    SET name=?, description=?, price=?, stock=?, category_id=?, image=? 
    WHERE id=?
  `;
  db.query(sql, [
    data.name,
    data.description,
    data.price,
    data.stock,
    data.category_id,
    data.image, // ← add image
    id
  ], callback);
}

  static delete(id, callback) {
    db.query("DELETE FROM medicines WHERE id = ?", [id], callback);
  }
}

module.exports = Medicine;