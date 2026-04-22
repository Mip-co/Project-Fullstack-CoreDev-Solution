const errorHandler = require("../utils/errorHandler");

// middleware pembagian peran melalui role 
function authorize(...roles) {
  return (req, res, next) => {

    // 🔥 cek apakah user ada (biar aman)
    if (!req.user) {
      return errorHandler(res, "Unauthorized", 401, "User belum login");
    }

    // 🔥 support banyak role (admin, user, dll)
    if (!roles.includes(req.user.role)) {
      return errorHandler(res, "Forbidden", 403, "Tidak Ada Akses");
    }

    next();
  };
}

module.exports = authorize;