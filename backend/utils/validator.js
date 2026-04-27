// utils/validator.js

// Validasi Data Obat (Pertemuan sebelumnya)
function validateMedicine(data) {
    if (!data.name) return "Nama obat wajib diisi"; 
    if (!data.price || isNaN(data.price)) return "Harga harus berupa angka"; 
    if (!data.stock || isNaN(data.stock)) return "Stok harus berupa angka";
    if (!data.category_id) return "Category ID wajib diisi";
    return null; 
}

// Validasi ID untuk URL Params
function validateId(id) {
    if (!id || isNaN(id)) return "ID tidak valid"; 
    return null;
}

// Validasi File Upload (Materi Pertemuan 7)
function validateFile(file) {
    // Bersifat opsional, boleh tidak upload 
    if (!file) return null; 

    // Validasi Tipe File (JPG, PNG, GIF) 
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return "Format harus berupa gambar (jpg, png, gif)"; 
    }

    // Validasi Ukuran File (Maksimal 2MB) 
    if (file.size > 2 * 1024 * 1024) {
        return "Ukuran file maksimal 2MB"; 
    }

    return null; // Valid
}

module.exports = { validateMedicine, validateId, validateFile }; 