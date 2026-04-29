const Medicine = require("../models/Medicine");
const errorHandler = require("../utils/errorHandler");
const { validateMedicine, validateId } = require("../utils/validator");

class MedicineController {
  // GET: Tampil Semua
  index(req, res) {
    Medicine.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil data");
      res.json({ success: true, data: results });
    });
  }

  // GET: Detail satu obat
  show(req, res) {
    const { id } = req.params;
    Medicine.getById(id, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      if (!result || result.length === 0) return errorHandler(res, "Obat tidak ditemukan", 404);
      res.json({ success: true, data: result[0] });
    });
  }

  // POST: Tambah Obat (Create)
  store(req, res) {
    const error = validateMedicine(req.body);
    if (error) return errorHandler(res, error, 400);

  // Ambil image dari body (sementara, bukan upload file)
  const data = {
    ...req.body,
    image: req.body.image || null
  };

  Medicine.create(data, (err) => {
    if (err) return errorHandler(res, err, 500, "Gagal simpan database");
    res.status(201).json({ success: true, message: "Obat berhasil ditambahkan" });
  });
}

  // PUT: Ubah Obat (Update)
  update(req, res) {
    const { id } = req.params;

    const idError = validateId(id);
    if (idError) return errorHandler(res, idError, 400);

    const error = validateMedicine(req.body);
    if (error) return errorHandler(res, error, 400);

    const data = {
      ...req.body,
      image: req.body.image || null
    };

    Medicine.update(id, data, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      if (result.affectedRows === 0) return errorHandler(res, "Obat tidak ditemukan", 404);

      res.json({ success: true, message: "Data obat berhasil diperbarui" });
    });
  }

  // DELETE: Hapus Obat
  destroy(req, res) {
    const { id } = req.params;
    Medicine.delete(id, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      if (result.affectedRows === 0) return errorHandler(res, "Gagal hapus, data tidak ada", 404);
      res.json({ success: true, message: "Obat berhasil dihapus" });
    });
  }
}

module.exports = new MedicineController();