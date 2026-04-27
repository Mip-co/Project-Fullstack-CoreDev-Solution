// errorHandler.js - Helper untuk kirim response error

class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

// Helper untuk kirim response error manual
const sendError = (res, error, status = 500, message = "Terjadi kesalahan") => {
  console.error(error);

  return res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development"
      ? error?.message || error
      : undefined
  });
};

// Global error middleware (Express)
const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development"
      ? err.stack
      : undefined
  });
};

// Async wrapper biar gak perlu try-catch
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  sendError,
  globalErrorHandler,
  asyncHandler
};