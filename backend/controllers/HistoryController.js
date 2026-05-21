const History = require("../models/History"); // Model baru
const { sendError } = require("../utils/errorHandler");

class HistoryController {
  // TAMPILKAN SEMUA RIWAYAT USER
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

  // UPDATE STATUS (Misal oleh Admin atau setelah bayar)[cite: 1, 2]
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