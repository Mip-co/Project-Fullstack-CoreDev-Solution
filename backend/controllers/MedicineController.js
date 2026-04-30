const Medicine = require("../models/Medicine");
const { sendError } = require("../utils/errorHandler");

class MedicineController {
  // GET: Tampil Semua
  index(req, res) {
    Medicine.getAll((err, results) => {
      if (err) return sendError(res, err, 500, "Gagal mengambil data");
      res.json({ success: true, data: results });
    });
  }

  // GET: Detail satu obat
  show(req, res) {
    const { id } = req.params;
    Medicine.getById(id, (err, result) => {
      if (err) return sendError(res, err, 500);
      if (!result || result.length === 0)
        return sendError(res, "Obat tidak ditemukan", 404);
      res.json({ success: true, data: result[0] });
    });
  }

  // POST: Tambah Obat (Create)
  store(req, res) {
    const { name, price, stock, category_id } = req.body;

    if (!name || !price || !stock || !category_id) {
      return sendError(
        res,
        "Field nama, harga, stok, dan kategori wajib diisi!",
        400
      );
    }

    if (isNaN(price) || isNaN(stock)) {
      return sendError(res, "Harga dan Stok harus berupa angka!", 400);
    }

    Medicine.create(req.body, (err) => {
      if (err) return sendError(res, err, 500, "Gagal simpan database");
      res
        .status(201)
        .json({ success: true, message: "Obat berhasil ditambahkan" });
    });
  }

  // PUT: Ubah Obat (Update)
  update(req, res) {
    const { id } = req.params;
    const { price, stock } = req.body;

    if (price && isNaN(price))
      return sendError(res, "Harga harus angka", 400);

    if (stock && isNaN(stock))
      return sendError(res, "Stok harus angka", 400);

    Medicine.update(id, req.body, (err, result) => {
      if (err) return sendError(res, err, 500);
      if (result.affectedRows === 0)
        return sendError(res, "Obat tidak ditemukan", 404);

      res.json({
        success: true,
        message: "Data obat berhasil diperbarui",
      });
    });
  }

  // DELETE: Hapus Obat
  destroy(req, res) {
    const { id } = req.params;
    Medicine.delete(id, (err, result) => {
      if (err) return sendError(res, err, 500);
      if (result.affectedRows === 0)
        return sendError(res, "Gagal hapus, data tidak ada", 404);

      res.json({
        success: true,
        message: "Obat berhasil dihapus",
      });
    });
  }
}

module.exports = new MedicineController();