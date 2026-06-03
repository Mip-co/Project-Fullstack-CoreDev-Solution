import http from "./http";

export function getMedicines() {
  return http.get("/medicines"); // Otomatis nembak ke /api/medicines lewat proxy
}