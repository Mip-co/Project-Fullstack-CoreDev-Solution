function validateRegister(data) {
    if (!data.name) return "nama wajib diisi";
    if (!data.email) return "email wajib diisi";
    if (!data.password) return "password wajib diisi";

    // tambahan dikit biar lebih valid
    if (!data.email.includes("@")) return "format email tidak valid";
    if (data.password.length < 6) return "password minimal 6 karakter";

    return null;
}

function validateLogin(data) {
    if (!data.email) return "email wajib diisi";
    if (!data.password) return "password wajib diisi";

    if (!data.email.includes("@")) return "format email tidak valid";

    return null;
}

module.exports = { validateRegister, validateLogin };