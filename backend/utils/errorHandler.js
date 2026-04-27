// utils/errorHandler.js

/**
 * Helper untuk mengirim response error secara manual (seperti di modul)
 */
const sendError = (res, error, status = 500, message = "Terjadi kesalahan") => {
  console.error(error);
  return res.status(status).json({
    success: false,
    message,
    error: error?.message || error
  });
};

/**
 * Async Wrapper: Biar Silva & Adit gak perlu nulis try-catch lagi di Controller
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global Error Middleware: Pusat kendali semua error aplikasi
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log detail error di terminal

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Hanya tampilkan detail error di mode development
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

module.exports = {
  sendError,
  asyncHandler,
  globalErrorHandler
};