const Medicine = require("../models/Medicine");
const { sendError } = require("../utils/errorHandler");
const { validateMedicine, validateId } = require("../utils/validator");

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
    const error = validateMedicine(req.body);
    if (error) return errorHandler(res, error, 400);

// Versi Final Store (Sudah mendukung Gambar & Validasi Pro)
  store(req, res) {
    // 1. Jalankan Validasi Teks (Tugas Silva/Amaya)
    const error = validateMedicine(req.body);
    if (error) return sendError(res, error, 400);

    // 2. Siapkan data, pastikan kolom 'image' terisi nama file dari Multer (Tugas Adit)
    const data = {
      ...req.body,
      image: req.file ? req.file.filename : null // Ambil dari middleware upload.js
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

  // PUT: Ubah Obat (Update)
  update(req, res) {
    const { id } = req.params;
// Versi Final Update (Sudah rapi & mendukung upload gambar baru)
  update(req, res) {
    const { id } = req.params;

    // 1. Validasi ID (Tugas Amaya)
    const idError = validateId(id);
    if (idError) return sendError(res, idError, 400);

    // 2. Validasi Teks (Tugas Silva/Amaya)
    const textError = validateMedicine(req.body);
    if (textError) return sendError(res, textError, 400);

    // 3. Siapkan data (Jika ada upload foto baru, pakai foto baru. Jika tidak, tetap pakai data lama)
    const data = {
      ...req.body,
      ...(req.file && { image: req.file.filename }) // Logika upload Adit
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