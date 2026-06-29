const History = require("../models/History");
const { sendError } = require("../utils/errorHandler");

class HistoryController {
  // TAMPILKAN RIWAYAT ORDER MILIK SATU USER (untuk halaman history user biasa)
  index(req, res) {
    const { userId } = req.params;

    History.getByUserId(userId, (err, results) => {
      if (err) return sendError(res, err, 500);
      res.json({
        success: true,
        data: results
      });
    });
  }

  // [FIX BARU] TAMPILKAN SEMUA ORDER DARI SELURUH USER (untuk Admin Dashboard)
  // Dipanggil oleh route: GET /api/orders
  indexAll(req, res) {
    History.getAll((err, results) => {
      if (err) return sendError(res, err, 500);
      res.json({
        success: true,
        data: results
      });
    });
  }

  // UPDATE STATUS ORDER (oleh Admin)
  update(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return sendError(res, "Status baru wajib diisi!", 400);

    History.updateStatus(id, status, (err, result) => {
      if (err) return sendError(res, err, 500);
      if (result.affectedRows === 0) return sendError(res, "Pesanan tidak ditemukan", 404);

      res.json({
        success: true,
        message: `Status pesanan berhasil diubah menjadi ${status}`
      });
    });
  }
}

module.exports = new HistoryController();
