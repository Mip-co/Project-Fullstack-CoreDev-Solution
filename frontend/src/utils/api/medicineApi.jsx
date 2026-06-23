import http from "./http";

/**
 * Service API Obat/Medicines Kelompok ApotekApp
 * Menggunakan instance Axios 'http' yang mengarah ke proxy backend
 */

// 1. Ambil semua katalog obat dari backend
export const getMedicines = async () => {
  const response = await http.get("/medicines");
  return response.data;
};

// 2. TARGET ADIT: Ambil detail satu obat spesifik berdasarkan ID
export const getMedicineById = async (id) => {
  const response = await http.get(`/medicines/${id}`);
  return response.data;
};