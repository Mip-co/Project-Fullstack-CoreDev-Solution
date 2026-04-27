// utils/validator.js
function validateMedicine(data) {
  if (!data.name) return "Nama obat wajib diisi"; 
  if (!data.price || isNaN(data.price)) return "Harga harus berupa angka"; 
  if (!data.stock || isNaN(data.stock)) return "Stok harus berupa angka";
  if (!data.category_id) return "Category ID wajib diisi";
  return null; // Return null jika semua valid [cite: 1479]
}

function validateId(id) {
  if (!id || isNaN(id)) return "ID tidak valid"; 
  return null;
}
function validateFile(file){
    if(!file) return null;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return "Format harus berupa gambar (jpg, png, gif)";
    }

    // validasi ukuran file (misalnya maksimal 5MB)
    if(file.size > 2 * 1024 * 1024){
        return "Ukuran file maksimal 2MB";
    }
    return null;
}
module.exports = { validateMedicine, validateId, validateFile };