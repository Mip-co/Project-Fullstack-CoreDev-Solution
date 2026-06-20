import http from "./http";

/**
 * Service API Autentikasi Kelompok ApotekApp
 * Menggunakan instance Axios 'http' yang sudah terkonfigurasi
 */

export const loginUser = async (email, password) => {
  const response = await http.post("/login", { email, password });
  return response.data; // Menghasilkan token dan data user dari Express.js
};

export const registerUser = async (userData) => {
  // userData berisi objek: { name, email, password, password_confirmation }
  const response = await http.post("/register", userData);
  return response.data;
};