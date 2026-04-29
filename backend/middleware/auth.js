const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/errorHandler");
function auth(req, res, next) {
  const bearer = req.headers.authorization;

  // cek apakah header ada
  if (!bearer) {
    return sendError(res, "Unauthorized", 401);
  }

  // cek format "Bearer token"
  const split = bearer.split(" ");
  if (split.length !== 2 || split[0] !== "Bearer") {
    return sendError(res, "Format token salah", 401);
  }

  const token = split[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 opsional tapi recommended (validasi isi token)
    if (!decoded.id || !decoded.email || !decoded.role) {
      return sendError(res, "Token tidak lengkap", 401);
    }

    req.user = decoded; // { id, email, role }

    next();
  } catch (err) {
    return sendError(res, "Token tidak valid / expired", 401);
  }
}

module.exports = auth;