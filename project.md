# Project.md — Peta Project Apotek Online

Dokumen ini dibuat supaya AI lain atau anggota tim baru bisa cepat memahami keseluruhan project: struktur folder, modul yang dipakai, daftar fungsi penting, alur antar fungsi, API, database, dan catatan potensi masalah.

## 1. Ringkasan Project

Project ini adalah aplikasi **Apotek Online / ApotekApp / ApotekNow** berbasis fullstack:

- **Frontend**: React + Vite untuk katalog obat, keranjang, checkout dummy, login/register dummy, dan dashboard profil.
- **Backend**: Express.js + MySQL untuk API obat, user/auth, cart, checkout, history order, upload gambar, dan JWT auth.
- **Database**: MySQL/MariaDB dengan tabel `users`, `categories`, `medicines`, `carts`, `cart_items`, `orders`, dan `order_items`.

Secara konsep, frontend mengambil data obat dari backend `/api/medicines`, user bisa menambahkan obat ke state keranjang di React, lalu checkout di UI. Backend sudah punya endpoint untuk proses cart dan checkout berbasis database, tetapi frontend saat ini sebagian besar masih memakai state lokal/dummy untuk cart, login, checkout, dan dashboard.

## 2. Tech Stack dan Modul Utama

### Root

- `package.json` root hanya berisi dependency `multer`.

### Backend (`backend/`)

Runtime dan modul:

- `express`: server HTTP dan routing API.
- `mysql2`: koneksi dan query MySQL/MariaDB.
- `dotenv`: membaca environment variable seperti `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`.
- `jsonwebtoken`: membuat dan memverifikasi JWT.
- `bcryptjs`: hash dan compare password.
- `multer`: upload file gambar ke `backend/uploads/`.
- `nodemon`: dev server.

Script:

```bash
cd backend
npm run start
```

Server backend berjalan di `http://localhost:3000`.

### Frontend (`frontend/`)

Runtime dan modul:

- `react`: UI component dan hooks.
- `react-dom`: render React ke DOM.
- `axios`: HTTP client.
- `vite`: dev server/build tool.
- `@vitejs/plugin-react`: plugin React untuk Vite.
- `eslint`: linting.

Catatan: source frontend memakai `react-router-dom`, tetapi dependency ini belum terlihat di `frontend/package.json`. Jika install bersih gagal, tambahkan dependency tersebut.

Script:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

Vite proxy mengarahkan request `/api` ke `http://localhost:3000`.

## 3. Struktur Folder Ringkas

```text
.
├── backend/
│   ├── app.js                    # Entry point Express
│   ├── config/database.js         # Koneksi MySQL
│   ├── controllers/               # Handler request/response API
│   ├── middleware/                # Auth JWT, role authorization, upload multer
│   ├── models/                    # Query database
│   ├── routes/api.js              # Semua route API /api/*
│   ├── uploads/                   # File upload gambar
│   └── utils/                     # Validator dan error handler
├── database/apotek_online.sql      # Dump schema + sample data
├── frontend/
│   ├── src/App.jsx                # State utama dan route halaman
│   ├── src/main.jsx               # Render React + BrowserRouter
│   ├── src/pages/                 # Halaman Home, Cart, Checkout, Login, dll.
│   ├── src/components/            # Navbar, Footer, Hero, MedicineCard, Container
│   ├── src/utils/api/             # Axios instance + API helper
│   └── vite.config.js             # Proxy /api ke backend
└── project.md                     # Dokumen peta project untuk AI/tim
```

## 4. Backend: Alur Besar

### Entry Point

File: `backend/app.js`

1. Import `express`.
2. Import router dari `./routes/api`.
3. Pasang middleware body parser:
   - `express.json()`
   - `express.urlencoded({ extended: true })`
4. Mount semua route di prefix `/api`.
5. Listen di port `3000`.

Alur request backend:

```text
Client / Frontend
  -> http://localhost:3000/api/...
  -> backend/app.js
  -> backend/routes/api.js
  -> middleware jika ada: auth, upload
  -> Controller
  -> Model
  -> MySQL
  -> JSON response
```

### Koneksi Database

File: `backend/config/database.js`

- Membuat koneksi MySQL via `mysql2.createConnection`.
- Config diambil dari environment variable:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
- Export object `db` untuk dipakai semua model.

## 5. Backend Routes dan Hubungan Controller/Model

File utama route: `backend/routes/api.js`

### Medicines

| Method | Endpoint | Middleware | Controller | Model/Fungsi Database |
|---|---|---|---|---|
| GET | `/api/medicines` | - | `MedicineController.index` | `Medicine.getAll` atau `Medicine.getByCategory` |
| GET | `/api/medicines/:id` | - | `MedicineController.show` | `Medicine.getById` |
| POST | `/api/medicines` | `auth`, `upload.single('image')` | `MedicineController.store` | `Medicine.create` |
| PUT | `/api/medicines/:id` | `auth`, `upload.single('image')` | `MedicineController.update` | `Medicine.update` |
| DELETE | `/api/medicines/:id` | `auth` | `MedicineController.destroy` | `Medicine.delete` |

Alur `GET /api/medicines`:

```text
api.js
  -> MedicineController.index(req, res)
      -> cek req.query.category_id
      -> jika ada: Medicine.getByCategory(category_id)
      -> jika tidak: Medicine.getAll()
      -> res.json({ success: true, data })
```

Alur tambah/update obat:

```text
api.js
  -> auth middleware validasi JWT
  -> upload.single('image') simpan file ke backend/uploads
  -> MedicineController.store/update
      -> validateMedicine(req.body)
      -> validateId(id) untuk update/delete/detail
      -> data.image diambil dari req.file.filename jika ada
      -> Medicine.create/update/delete
      -> JSON response
```

### Auth dan User

| Method | Endpoint | Middleware | Controller | Model/Fungsi Database |
|---|---|---|---|---|
| POST | `/api/login` | - | `UserController.login` | `User.findByEmail` |
| POST | `/api/register` | - | `UserController.register` | `User.create` |
| GET | `/api/users/:id` | `auth` | `UserController.show` | `User.findById` |
| PUT | `/api/users/:id` | `auth` | `UserController.update` | `User.update` |
| GET | `/api/profile` | `auth` | inline handler | dari `req.user` hasil JWT |
| PUT | `/api/profile/image` | `auth`, `upload.single('photo')` | `AuthController.updateProfileImage` | `User.updateProfileImage` |

Alur login backend:

```text
api.js
  -> UserController.login
      -> validasi email/password wajib ada
      -> User.findByEmail(email)
      -> bcrypt.compare(password, user.password)
      -> jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '1d' })
      -> response token
```

Alur register backend:

```text
api.js
  -> UserController.register
      -> validasi name/email/password wajib ada
      -> bcrypt.hash(password, 10)
      -> User.create({ ..., role: 'user' })
      -> response userId
```

Catatan: ada dua controller auth/user:

- `backend/controllers/UserController.js` dipakai oleh `/login`, `/register`, `/users/:id`.
- `backend/controllers/authController.js` punya fungsi `register`, `login`, `updateProfileImage`, tetapi route hanya memakai `updateProfileImage`.

### Cart

| Method | Endpoint | Middleware | Controller | Model/Fungsi Database |
|---|---|---|---|---|
| POST | `/api/cart` | `auth` | `CartController.add` | `Cart.addItem` |
| PUT | `/api/cart/:id` | `auth` | `CartController.update` | `Cart.updateQuantity` |
| GET | `/api/cart/user/:userId` | `auth` | `CartController.show` | `Cart.getByUser` |
| DELETE | `/api/cart/:id` | `auth` | `CartController.delete` | `Cart.deleteItem` |

Alur tambah cart:

```text
api.js
  -> auth
  -> CartController.add
      -> ambil cart_id, medicine_id, quantity dari req.body
      -> validasi wajib ada dan quantity >= 1
      -> Cart.addItem(...)
      -> response berhasil
```

Alur lihat cart user:

```text
api.js
  -> auth
  -> CartController.show
      -> Cart.getByUser(userId)
          -> JOIN cart_items + medicines + carts
      -> response data cart + detail medicine
```

### Checkout dan History Order

| Method | Endpoint | Middleware | Controller | Model/Fungsi Database |
|---|---|---|---|---|
| POST | `/api/checkout` | `auth` | `CheckoutController.store` | `Cart.getByUser`, `Checkout.createOrder`, `Checkout.createOrderItem`, `Cart.deleteItem` |
| GET | `/api/orders/user/:userId` | `auth` | `HistoryController.index` | `History.getByUserId` |
| GET | `/api/orders/history/:userId` | `auth` | `HistoryController.index` | `History.getByUserId` |
| PUT | `/api/orders/:id/status` | `auth` | `HistoryController.update` | `History.updateStatus` |

Alur checkout backend:

```text
api.js
  -> auth
  -> CheckoutController.store
      -> ambil user_id dari req.body
      -> Cart.getByUser(user_id)
      -> hitung total_price = sum(price * quantity)
      -> Checkout.createOrder({ user_id, total_price })
      -> untuk setiap cart item:
          -> Checkout.createOrderItem({ order_id, medicine_id, quantity, price })
          -> Cart.deleteItem(item.id)
      -> response order_id dan total_bayar
```

Alur history:

```text
api.js
  -> auth
  -> HistoryController.index
      -> History.getByUserId(userId)
      -> SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
```

## 6. Backend: Daftar Model dan Fungsi

### `Medicine` model (`backend/models/Medicine.js`)

- `getAll(callback)`: ambil semua obat, join kategori.
- `getByCategory(categoryId, callback)`: ambil obat berdasarkan `category_id`.
- `getById(id, callback)`: ambil detail obat berdasarkan `id`, join kategori.
- `create(data, callback)`: insert obat baru ke tabel `medicines`.
- `update(id, data, callback)`: update obat berdasarkan `id`.
- `delete(id, callback)`: delete obat berdasarkan `id`.

Dipakai oleh `MedicineController`.

### `User` model (`backend/models/User.js`)

- `create(data, callback)`: insert user baru.
- `findById(id, callback)`: ambil user tanpa password.
- `findByEmail(email, callback)`: ambil user lengkap untuk login.
- `update(id, data, callback)`: update profil user.
- `updateProfileImage(id, filename, callback)`: update foto profil.

Dipakai oleh `UserController` dan `AuthController`.

### `Cart` model (`backend/models/Cart.js`)

- `addItem(data, callback)`: insert ke `cart_items`.
- `updateQuantity(id, quantity, callback)`: update quantity item cart.
- `deleteItem(id, callback)`: hapus item cart.
- `getByUser(userId, callback)`: ambil cart user dengan JOIN ke `medicines`.

Dipakai oleh `CartController` dan `CheckoutController`.

### `Checkout` model (`backend/models/Checkout.js`)

- `createOrder(data, callback)`: insert order header ke `orders` dengan status `pending`.
- `createOrderItem(data, callback)`: insert item order ke `order_items`.

Dipakai oleh `CheckoutController`.

### `History` model (`backend/models/History.js`)

- `getByUserId(userId, callback)`: ambil order milik user.
- `updateStatus(id, status, callback)`: update status order.

Dipakai oleh `HistoryController`.

## 7. Backend: Middleware dan Utils

### `auth` middleware (`backend/middleware/auth.js`)

Fungsi `auth(req, res, next)`:

1. Ambil header `Authorization`.
2. Format wajib: `Bearer <token>`.
3. `jwt.verify(token, process.env.JWT_SECRET)`.
4. Jika valid, simpan payload ke `req.user`.
5. Lanjut `next()`.

Dipakai di route protected: medicine create/update/delete, users, cart, checkout, orders, profile.

### `authorize` middleware (`backend/middleware/authorize.js`)

Fungsi `authorize(...roles)`:

- Mengembalikan middleware yang mengecek `req.user.role`.
- Jika role tidak cocok, kirim error forbidden.

Catatan: middleware ini belum dipakai di `routes/api.js`.

### `upload` middleware (`backend/middleware/upload.js`)

- Menggunakan `multer.diskStorage`.
- Destination: `backend/uploads/`.
- Filename: timestamp + random number + original filename.
- Export `upload` untuk `upload.single('image')` dan `upload.single('photo')`.

### Validator (`backend/utils/validator.js`)

- `validateMedicine(data)`: cek field wajib obat.
- `validateId(id)`: cek id numeric/valid.
- `validateFile(file)`: cek file upload.

### Auth Validator (`backend/utils/authValidator.js`)

- `validateRegister(data)`: cek name/email/password.
- `validateLogin(data)`: cek email/password.

### Error Handler (`backend/utils/errorHandler.js`)

- `sendError(res, error, status, message)`: format response error JSON.
- `asyncHandler(fn)`: wrapper async route.
- `globalErrorHandler(err, req, res, next)`: middleware error global.

## 8. Frontend: Alur Besar

### Entry Point

File: `frontend/src/main.jsx`

```text
main.jsx
  -> ReactDOM.createRoot(...).render(...)
  -> BrowserRouter membungkus App
  -> App.jsx mengatur route halaman
```

### App State dan Routing

File: `frontend/src/App.jsx`

State utama:

- `cart`: array item keranjang lokal.
- `checkoutItems`: array item yang sedang diproses checkout.
- `currentUser`: user yang login di UI/dummy.

Handler utama:

- `handleAddToCart(itemPilihan)`: tambah item ke `cart`, jika sudah ada quantity bertambah.
- `handleUpdateQuantity(id, type)`: increase/decrease quantity item cart.
- `handleRemoveItem(id)`: hapus item dari cart.
- `handleClearCart()`: kosongkan cart.
- `handleGoToCheckout(barangTerpilih)`: simpan item terpilih ke `checkoutItems`.
- `handleExecutePayment(dataTransaksiLengkap)`: alert sukses, hapus item checkout dari cart, kosongkan `checkoutItems`.
- `totalItemsCount`: total quantity di cart untuk badge navbar.

Route frontend:

| URL | Component | Props penting |
|---|---|---|
| `/` | `Home` | `onAddToCart` |
| `/cart` | `Cart` | `cartItems`, `onUpdateQuantity`, `onRemoveItem`, `onClearCart`, `onCheckoutReady` |
| `/checkout` | `Checkout` | `checkoutItems`, `onExecutePayment` |
| `/login` | `Login` | `onLoginSuccess` |
| `/register` | `Register` | - |
| `/dashboard` | `Dashboard` | `currentUser`, `onUpdateProfile` |

Alur frontend katalog sampai checkout:

```text
main.jsx
  -> App.jsx
      -> Route '/' render Home
          -> Home useEffect getMedicines()
              -> medicineApi.getMedicines()
                  -> http.get('/medicines')
                      -> Vite proxy ke backend /api/medicines
          -> Home render MedicineCard untuk tiap obat
              -> MedicineCard tombol Beli memanggil onAddToCart(obat)
                  -> App.handleAddToCart update state cart
      -> Navbar menerima cartCount
      -> Route '/cart' render Cart
          -> tombol checkout memanggil onCheckoutReady(item terpilih)
          -> navigate('/checkout')
      -> Route '/checkout' render Checkout
          -> form submit memanggil onExecutePayment(data transaksi)
              -> App.handleExecutePayment alert + update state cart
```

## 9. Frontend: Komponen dan Fungsi Penting

### API Helper

#### `frontend/src/utils/api/http.js`

- Membuat instance Axios dengan `baseURL: '/api'`.
- Header default `Content-Type: application/json`.

#### `frontend/src/utils/api/medicineApi.jsx`

- `getMedicines()`: memanggil `GET /api/medicines` lewat Axios.

### Pages

#### `Home.jsx`

- Menggunakan `useEffect` untuk load obat dari backend via `getMedicines()`.
- State:
  - `medicines`
  - `loading`
  - `error`
  - `selectedCategory`
- Memiliki daftar kategori UI: `Semua`, `Obat Bebas`, `Obat Resep`, `Vitamin`, `Alat Kesehatan`.
- Filter frontend berdasarkan `category_name`.
- Render `Hero` dan grid `MedicineCard`.
- `MedicineCard` menerima `onAddToCart` dari `App`.

#### `Cart.jsx`

- Menghitung:
  - `totalHarga`
  - `totalJenisProduk`
- Render list item cart, tombol plus/minus, hapus item, clear cart.
- Menggunakan `useNavigate` untuk pindah ke `/checkout`.
- Saat checkout, memanggil `onCheckoutReady(cartItems)` lalu navigate.

#### `Checkout.jsx`

- State form pengiriman:
  - `nama`
  - `alamat`
  - `telepon`
  - `catatan`
- State metode pengiriman: `shippingMethod`.
- Menghitung:
  - `biayaPengiriman`
  - `totalHargaBarang`
  - `totalAkhirTagihan`
- `handleInputChange(e)`: update form.
- `handleSubmitOrder(e)`: validasi checkout items dan panggil `onExecutePayment`.

#### `Login.jsx`

- State form login dummy: email + password.
- `handleInputChange(e)`: update form.
- `handleSubmit(e)`: login dummy hanya berhasil jika:
  - email: `mimi@klinik.com`
  - password: `password123`
- Jika berhasil, panggil `onLoginSuccess({ name, role })`.

Catatan: halaman ini belum memakai API backend `/api/login`.

#### `Register.jsx`

- State form register dummy.
- `handleSubmit(e)`: validasi password dan confirm password sama.
- Alert berhasil lalu arahkan ke login via `onViewChange` jika prop tersedia.

Catatan: halaman ini belum memakai API backend `/api/register`.

#### `Dashboard.jsx`

- State:
  - `activeTab`: `profile` atau `orders`.
  - `avatarPreview`
  - `profileForm`
- Ref: `fileInputRef`.
- Handler:
  - `handleInputChange`
  - `handleUploadClick`
  - `handleFileChange`
  - `handleRemovePhoto`
  - `handleSaveProfile`
- Menampilkan data profil dan dummy orders.

### Components

#### `Navbar.jsx`

- Props: `cartCount`, `currentUser`.
- Menggunakan `Link` dan `useLocation` dari `react-router-dom`.
- Menampilkan badge cart.
- Jika `currentUser` ada, tampilkan avatar link ke dashboard.
- Jika belum login, tampilkan tombol login.

#### `Footer.jsx`

- Footer statis berisi brand, tautan cepat, kontak, dan copyright.

#### `Hero.jsx`

- Hero section statis dengan search bar visual, tag kategori, dan ilustrasi kapsul CSS.

#### `MedicineCard.jsx`

- Props: `obat`, `onAddToCart`.
- Mapping field database:
  - `obat.name` -> nama obat.
  - `obat.description` -> deskripsi.
  - `obat.price` -> harga.
  - `obat.stock` -> stok.
- Validasi gambar: jika `obat.image` URL valid, pakai itu; jika tidak, pakai fallback Unsplash.
- Tombol `Beli` memanggil `onAddToCart(obat)`.

#### `Container.jsx`

- Wrapper layout dengan `maxWidth: 1200px`.

#### `layout/index.jsx`

- Komponen `Layout` yang menggabungkan Navbar, Container, dan Footer.
- Saat ini `App.jsx` memakai Navbar/Footer langsung, bukan `Layout`.

## 10. Database

File: `database/apotek_online.sql`

### Tabel Utama

#### `users`

Kolom penting:

- `id`
- `name`
- `email`
- `password`
- `phone`
- `address`
- `role`: enum `admin` atau `user`
- `profile_picture`
- `created_at`

Dipakai oleh auth/profile.

#### `categories`

Kolom:

- `id`
- `name`
- `description`
- `created_at`

Dipakai untuk kategori obat.

#### `medicines`

Kolom:

- `id`
- `category_id`
- `name`
- `description`
- `price`
- `stock`
- `image`
- `created_at`

Dipakai katalog obat.

#### `carts`

Kolom:

- `id`
- `user_id`
- `created_at`

Header cart milik user.

#### `cart_items`

Kolom:

- `id`
- `cart_id`
- `medicine_id`
- `quantity`

Item di cart.

#### `orders`

Kolom:

- `id`
- `user_id`
- `total_price`
- `status`
- `created_at`

Header pesanan.

#### `order_items`

Kolom:

- `id`
- `order_id`
- `medicine_id`
- `quantity`
- `price`

Detail item pesanan.

## 11. Dependency Map: Fungsi A Berjalan di Fungsi B

### Backend request map

```text
app.js
└── routes/api.js
    ├── MedicineController.index
    │   ├── Medicine.getByCategory
    │   └── Medicine.getAll
    ├── MedicineController.show
    │   ├── validateId
    │   └── Medicine.getById
    ├── MedicineController.store
    │   ├── auth middleware
    │   ├── upload.single('image')
    │   ├── validateMedicine
    │   └── Medicine.create
    ├── MedicineController.update
    │   ├── auth middleware
    │   ├── upload.single('image')
    │   ├── validateId
    │   ├── validateMedicine
    │   └── Medicine.update
    ├── MedicineController.destroy
    │   ├── auth middleware
    │   ├── validateId
    │   └── Medicine.delete
    ├── UserController.register
    │   ├── bcrypt.hash
    │   └── User.create
    ├── UserController.login
    │   ├── User.findByEmail
    │   ├── bcrypt.compare
    │   └── jwt.sign
    ├── UserController.show
    │   ├── auth middleware
    │   └── User.findById
    ├── UserController.update
    │   ├── auth middleware
    │   └── User.update
    ├── CartController.add
    │   ├── auth middleware
    │   └── Cart.addItem
    ├── CartController.update
    │   ├── auth middleware
    │   └── Cart.updateQuantity
    ├── CartController.show
    │   ├── auth middleware
    │   └── Cart.getByUser
    ├── CartController.delete
    │   ├── auth middleware
    │   └── Cart.deleteItem
    ├── CheckoutController.store
    │   ├── auth middleware
    │   ├── Cart.getByUser
    │   ├── Checkout.createOrder
    │   ├── Checkout.createOrderItem
    │   └── Cart.deleteItem
    ├── HistoryController.index
    │   ├── auth middleware
    │   └── History.getByUserId
    ├── HistoryController.update
    │   ├── auth middleware
    │   └── History.updateStatus
    └── AuthController.updateProfileImage
        ├── auth middleware
        ├── upload.single('photo')
        └── User.updateProfileImage
```

### Frontend component map

```text
main.jsx
└── BrowserRouter
    └── App.jsx
        ├── Navbar
        │   ├── Link('/')
        │   ├── Link('/cart')
        │   ├── Link('/dashboard') jika currentUser
        │   └── Link('/login') jika belum login
        ├── Routes
        │   ├── Home
        │   │   ├── getMedicines
        │   │   │   └── http.get('/medicines')
        │   │   ├── Hero
        │   │   └── MedicineCard
        │   │       └── onAddToCart -> App.handleAddToCart
        │   ├── Cart
        │   │   ├── onUpdateQuantity -> App.handleUpdateQuantity
        │   │   ├── onRemoveItem -> App.handleRemoveItem
        │   │   ├── onClearCart -> App.handleClearCart
        │   │   └── onCheckoutReady -> App.handleGoToCheckout
        │   ├── Checkout
        │   │   └── onExecutePayment -> App.handleExecutePayment
        │   ├── Login
        │   │   └── onLoginSuccess -> App.setCurrentUser
        │   ├── Register
        │   └── Dashboard
        │       └── onUpdateProfile -> App.setCurrentUser
        └── Footer
```

## 12. Catatan Penting untuk AI/Developer Selanjutnya

Bagian ini penting kalau AI lain diminta melanjutkan project.

### Hal yang sudah jalan secara konsep

- Backend punya struktur MVC sederhana: route -> controller -> model -> database.
- Endpoint medicines sudah dipakai frontend melalui `Home.jsx` -> `getMedicines()` -> `/api/medicines`.
- Backend sudah mendukung JWT auth untuk route protected.
- Backend sudah punya upload gambar obat/profil via Multer.
- Database dump sudah menyediakan schema dan sample data.

### Potensi masalah yang perlu dicek sebelum deploy

1. **Case-sensitive import AuthController**
   - Route memakai `require("../controllers/AuthController")`, sedangkan file di repo adalah `authController.js`.
   - Di Linux ini bisa error `Cannot find module`.
   - Solusi: samakan nama file/import.

2. **`CartController` memakai `errorHandler` yang tidak didefinisikan**
   - File import `{ sendError }`, tetapi beberapa method memanggil `errorHandler(...)`.
   - Solusi: ganti semua `errorHandler` menjadi `sendError`, atau import alias dengan benar.

3. **Kolom foto profil tidak konsisten**
   - Database punya `profile_picture`.
   - `User.updateProfileImage` melakukan update ke `profile_image`.
   - Solusi: ubah query ke `profile_picture` atau ubah schema supaya konsisten.

4. **Frontend memakai `react-router-dom`, tetapi dependency belum ada di `frontend/package.json`**
   - Tambahkan `react-router-dom` jika install/build gagal.

5. **Frontend auth/cart/checkout masih banyak dummy/local state**
   - Login/Register UI belum memanggil `/api/login` dan `/api/register`.
   - Cart UI belum memakai endpoint `/api/cart`.
   - Checkout UI belum memakai endpoint `/api/checkout`.

6. **Upload image obat**
   - Backend menyimpan filename lokal, sedangkan frontend `MedicineCard` hanya menampilkan image jika berbentuk URL `http/https`; jika filename biasa, frontend pakai fallback Unsplash.
   - Solusi: expose static folder uploads di Express, misalnya `app.use('/uploads', express.static('uploads'))`, lalu frontend format URL gambar.

7. **Security/authorization**
   - `auth` hanya validasi login, belum membatasi admin/user.
   - Middleware `authorize` ada tapi belum dipakai.
   - Untuk create/update/delete obat sebaiknya pakai `auth` + `authorize('admin')`.

## 13. Contoh Prompt untuk AI Lain

Kalau teman ingin melanjutkan project, bisa pakai prompt seperti ini:

> Baca `project.md` dulu. Project ini adalah Apotek Online fullstack React + Express + MySQL. Tolong lanjutkan fitur login/register frontend agar memakai backend API asli. Perhatikan alur di bagian dependency map, gunakan Axios instance di `frontend/src/utils/api/http.js`, simpan JWT, dan jangan rusak flow cart lokal yang sudah ada.

Atau:

> Baca `project.md`. Tolong fix backend supaya bisa jalan di Linux: case-sensitive AuthController, errorHandler di CartController, dan kolom profile_picture/profile_image. Setelah itu jalankan minimal `node -c` untuk file backend yang diubah.

## 14. Cara Menjalankan Project Lokal

### Backend

```bash
cd backend
npm install
# buat file .env sesuai database lokal
npm run start
```

Contoh `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=apotek_online
JWT_SECRET=secret_dev_key
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka URL yang diberikan Vite, biasanya `http://localhost:5173`.

### Database

Import `database/apotek_online.sql` ke MySQL/MariaDB, lalu pastikan nama database sesuai `DB_NAME`.

