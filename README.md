# 💊 ApotekNow

Aplikasi **Apotek Online** berbasis fullstack — katalog obat, keranjang belanja, checkout, riwayat pesanan, hingga dashboard admin. Dibangun dengan React + Vite di sisi frontend dan Express.js + MySQL di sisi backend.

🔗 **Live Demo:** [apoteknow.syslabs.cloud/login](https://apoteknow.syslabs.cloud/login)

---

## 📖 Tentang Project

ApotekNow adalah sistem manajemen apotek yang menghubungkan pengguna (pembeli obat) dan admin (pengelola stok & pesanan) dalam satu platform. Frontend mengambil data obat dari backend melalui `/api/medicines`, pengguna dapat menambahkan obat ke keranjang, melakukan checkout, dan memantau riwayat pesanan. Admin memiliki dashboard tersendiri untuk mengelola data obat, kategori, pengguna, dan melihat statistik penjualan.

## 📸 Preview

> Screenshot aplikasi akan ditambahkan menyusul.

| Halaman | Preview |
|---|---|
| Home | _Screenshot menyusul_ |
| Dashboard User | _Screenshot menyusul_ |
| Dashboard Admin | _Screenshot menyusul_ |
| Checkout | _Screenshot menyusul_ |

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Axios
- Recharts (visualisasi data di Admin Dashboard)

**Backend**
- Express.js
- MySQL / MariaDB (`mysql2`)
- JSON Web Token (`jsonwebtoken`) untuk autentikasi
- Bcrypt.js untuk hashing password
- Multer untuk upload gambar
- Dotenv untuk environment variable

**Database**
- MySQL/MariaDB dengan tabel `users`, `categories`, `medicines`, `carts`, `cart_items`, `orders`, `order_items`

## 🏗️ Arsitektur Sistem

```text
Browser
    │
    ▼
React + Vite
    │
Axios HTTP Client
    │
    ▼
Express.js REST API
    │
    ▼
MySQL Database
```

Alur aplikasi secara singkat:

1. User mengakses aplikasi React.
2. Frontend mengirim request menggunakan Axios.
3. Backend Express.js memproses request.
4. Backend berkomunikasi dengan MySQL.
5. Data dikembalikan ke frontend dalam format JSON.

## ✨ Fitur Utama

- 🛒 Katalog obat dengan filter kategori (Obat Bebas, Obat Resep, Vitamin, Alat Kesehatan)
- 🧺 Keranjang belanja & checkout
- 🔐 Autentikasi pengguna berbasis JWT (login & register)
- 📦 Riwayat pesanan dan status transaksi
- 👤 Dashboard profil pengguna dengan upload foto
- 🛠️ Dashboard admin: manajemen obat (CRUD), kategori, dan pengguna
- 📊 Statistik penjualan & kategori obat menggunakan grafik interaktif (Recharts)
- 🖼️ Upload gambar obat via Multer

## 📁 Struktur Folder

```text
.
├── backend/
│   ├── app.js                    # Entry point Express
│   ├── config/database.js        # Koneksi MySQL
│   ├── controllers/              # Handler request/response API
│   ├── middleware/                # Auth JWT, role authorization, upload multer
│   ├── models/                    # Query database
│   ├── routes/api.js              # Semua route API /api/*
│   ├── uploads/                   # File upload gambar
│   └── utils/                     # Validator dan error handler
├── database/apotek_online.sql     # Dump schema + sample data
├── frontend/
│   ├── src/App.jsx                # State utama dan route halaman
│   ├── src/main.jsx                # Render React + BrowserRouter
│   ├── src/pages/                  # Halaman Home, Cart, Checkout, Login, Dashboard, dll.
│   ├── src/components/             # Navbar, Footer, Hero, MedicineCard, Container
│   ├── src/utils/api/              # Axios instance + API helper
│   └── vite.config.js              # Proxy /api ke backend
└── project.md                     # Dokumen peta project (untuk AI/tim)
```

## 🚀 Cara Menjalankan di Lokal

### 1. Clone Repository

```bash
git clone https://github.com/Mip-co/Project-Fullstack-CoreDev-Solution.git
cd Project-Fullstack-CoreDev-Solution
```

### 2. Setup Database

Import file `database/apotek_online.sql` ke MySQL/MariaDB lokal, lalu pastikan nama database sesuai dengan `DB_NAME` di `.env`.

### 3. Jalankan Backend

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=apotek_online
JWT_SECRET=secret_dev_key
```

Jalankan server:

```bash
npm run start
```

Backend akan berjalan di `http://localhost:3000`.

### 4. Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka URL yang diberikan oleh Vite (biasanya `http://localhost:5173`). Request `/api` akan otomatis di-proxy ke backend.

## 🔌 API Overview

| Modul | Contoh Endpoint | Deskripsi |
|---|---|---|
| Medicines | `GET /api/medicines`, `POST /api/medicines` | Katalog & manajemen obat |
| Auth | `POST /api/login`, `POST /api/register` | Autentikasi pengguna |
| Cart | `POST /api/cart`, `GET /api/cart/user/:userId` | Manajemen keranjang |
| Checkout | `POST /api/checkout` | Proses transaksi |
| Orders | `GET /api/orders/user/:userId` | Riwayat pesanan |
| Profile | `GET /api/profile`, `PUT /api/profile/image` | Profil pengguna |

Dokumentasi lebih lengkap mengenai alur, model, dan dependency map tersedia di [`project.md`](./project.md).

## 👥 Tim Pengembang

Project ini dikembangkan secara kolaboratif sebagai bagian dari proyek mata kuliah Pengembangan Aplikasi Fullstack di STT Terpadu Nurul Fikri. Seluruh anggota tim berkontribusi pada pengembangan frontend, backend, pengujian, dan dokumentasi sesuai dengan pembagian tugas pada setiap sprint.

## 🚀 Pengembangan Selanjutnya

- Integrasi Payment Gateway (Midtrans/Xendit)
- Email Notification setelah checkout
- Responsive Mobile UI yang lebih optimal
- Dark Mode
- Wishlist
- Review & Rating Obat
- Real-time Tracking Status Pesanan
- Dashboard Analytics yang lebih lengkap

## 📄 Lisensi

Project ini dibuat untuk keperluan pembelajaran/akademik.
