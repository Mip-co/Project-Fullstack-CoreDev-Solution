// utils/errorHandler.js
const errorHandler = (res, error, status = 500, message = "Terjadi kesalahan") => {
  console.error(error); // Log untuk developer 
  return res.status(status).json({
    success: false,
    message: message,
    error: error?.message || error // Menampilkan pesan error asli jika ada 
  });
};

module.exports = errorHandler;