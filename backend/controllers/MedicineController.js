const Medicine = require("../models/Medicine");
const { sendError } = require("../utils/errorHandler");
const { validateMedicine, validateId } = require("../utils/validator");

class MedicineController {
  // GET: Tampil Semua
 
  index(req, res) {
  const { category_id } = req.query; // Mengambil filter dari URL

  if (category_id) {
    // Jika ada filter kategori
    Medicine.getByCategory(category_id, (err, results) => {
      if (err) return sendError(res, err, 500);
      res.json({ success: true, data: results });
    });
  } else {
    // Jika tidak ada filter, tampilkan semua seperti biasa
    Medicine.getAll((err, results) => {
      if (err) return sendError(res, err, 500);
      res.json({ success: true, data: results });
    });
  }
}

  // GET: Detail satu obat
  show(req, res) {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return sendError(res, idError, 400);

    Medicine.getById(id, (err, result) => {
      if (err) return sendError(res, err, 500);
      if (!result || result.length === 0)
        return sendError(res, "Obat tidak ditemukan", 404);
      res.json({ success: true, data: result[0] });
    });
  }

  // POST: Tambah Obat (Create) - Versi Final
  store(req, res) {
    // 1. Jalankan Validasi Teks
    const error = validateMedicine(req.body);
    if (error) return sendError(res, error, 400);

    // 2. Siapkan data (Mendukung upload gambar Adit)
    const data = {
      ...req.body,
      image: req.file ? req.file.filename : null
    };

    // 3. Simpan ke database
    Medicine.create(data, (err) => {
      if (err) return sendError(res, err, 500, "Gagal simpan database");
      res.status(201).json({ 
        success: true, 
        message: "Obat berhasil ditambahkan" 
      });
    });
  }

  // PUT: Ubah Obat (Update) - Versi Final
  update(req, res) {
    const { id } = req.params;

    // 1. Validasi ID
    const idError = validateId(id);
    if (idError) return sendError(res, idError, 400);

    // 2. Validasi Teks
    const textError = validateMedicine(req.body);
    if (textError) return sendError(res, textError, 400);

    // 3. Siapkan data (Update foto jika ada file baru)
    const data = {
      ...req.body,
      ...(req.file && { image: req.file.filename })
    };

    Medicine.update(id, data, (err, result) => {
      if (err) return sendError(res, err, 500);
      if (result.affectedRows === 0) 
        return sendError(res, "Obat tidak ditemukan", 404);

      res.json({ 
        success: true, 
        message: "Data obat berhasil diperbarui" 
      });
    });
  }

  // DELETE: Hapus Obat
  destroy(req, res) {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return sendError(res, idError, 400);

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