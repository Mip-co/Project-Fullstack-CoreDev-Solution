const express = require("express");
const cors = require("cors"); // 🔑 1. Import library CORS
const apiRouter = require("./routes/api");
require("dotenv").config();

const app = express();

// 🔑 2. AKTIFKAN MIDDLEWARE CORS UNTUK MENGIZINKAN FRONTEND VITE (PORT 5173)
app.use(cors({
  origin: "http://localhost:5173", // Mengizinkan port asal frontend kalian
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder static uploads untuk asset gambar Adit
app.use("/uploads", express.static("uploads"));

// Pasang rute API kelompok
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});