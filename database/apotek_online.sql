-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Jun 2026 pada 14.32
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apotek_online`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(12, 12, '2026-06-29 11:22:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `medicine_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Obat Bebas', 'Dapat dibeli secara bebas tanpa resep dokter (Logo Hijau/Biru)', '2026-06-29 10:36:23'),
(2, 'Obat Keras', 'Wajib menyertakan resep dokter resmi dari klinik (Logo K)', '2026-06-29 10:36:23'),
(3, 'Vitamin & Suplemen', 'Untuk menjaga kebugaran tubuh dan imunitas nutrisi harian', '2026-06-29 10:36:23'),
(4, 'Alat Kesehatan Modern', 'Masker, perban, termometer digital, dan alat cek kesehatan', '2026-06-29 10:36:23'),
(5, 'Kosmetik Medis (Skincare)', 'Perawatan kulit sensitif yang direkomendasikan dokter spesialis', '2026-06-29 10:36:23'),
(6, 'Kotak P3K & Perban', 'Peralatan pertolongan pertama seperti kasa steril, plester, obat merah, dan alkohol', '2026-06-29 10:36:23');

-- --------------------------------------------------------

--
-- Struktur dari tabel `medicines`
--

CREATE TABLE `medicines` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `medicines`
--

INSERT INTO `medicines` (`id`, `category_id`, `name`, `description`, `price`, `stock`, `image`, `created_at`) VALUES
(2, 2, 'Amoxicillin Kapsul', 'Antibiotik untuk infeksi bakteri (Wajib Resep)', 35000.00, 48, '1782730382730-308005057-amoxilin.jpeg', '2026-04-30 07:12:09'),
(6, 1, 'Paracetamol', 'Obat penurun panas', 5000.00, 98, '1777700379007-841920110-Cuplikan layar 2026-04-30 174105.png', '2026-05-02 05:39:39'),
(7, 1, 'Promag Tablet', 'Obat sakit maag dan kembung untuk mengurangi gejala kelebihan asam lambung.', 9500.00, 50, '1782735526373-478751682-apotek_online_k24klik_2021101902504923085_Promag-Tablet-10s-1.jpg', '2026-06-29 12:17:52'),
(8, 1, 'Bodrex Migra', 'Obat untuk meredakan sakit kepala mencengkram dan migrain ringan.', 3500.00, 120, '1782735595166-934561701-bod_migra_rev0226.png', '2026-06-29 12:17:52'),
(9, 1, 'Antimo Anak', 'Sirup pencegah mabuk perjalanan rasa stroberi khusus untuk anak-anak.', 2500.00, 40, '1782735628434-185044853-images.jpg', '2026-06-29 12:17:52'),
(10, 2, 'Asam Mefenamat 500mg', 'Obat pereda nyeri meradang tingkat sedang seperti nyeri pasca operasi atau menstruasi.', 12000.00, 60, '1782735676428-148990261-181713de-057b-b36fdb-dbc8fbf5-fbf5fd2601-fd2601d0.jpeg', '2026-06-29 12:17:52'),
(11, 2, 'Metformin 500mg', 'Obat antidiabetes untuk mengontrol kadar gula darah pada penderita diabetes tipe 2.', 18000.00, 45, '1782735746000-507111255-metformin_500_mg_3_copy.png', '2026-06-29 12:17:52'),
(12, 2, 'Amlodipine 5mg', 'Obat penurun tekanan darah tinggi (hipertensi) dan pencegah nyeri dada.', 15000.00, 70, '1782735772024-290529362-AMLODIPINE+5+MG.png', '2026-06-29 12:17:52'),
(13, 3, 'Enervon-C Multivitamin', 'Suplemen vitamin untuk menjaga daya tahan tubuh dan membantu memulihkan kondisi pasca sakit.', 7500.00, 150, '1782735796579-555120739-600665_19-5-2022_13-22-12-1665779012.png', '2026-06-29 12:17:52'),
(14, 3, 'Sangobion Kapsul', 'Suplemen penambah darah untuk mengatasi anemia akibat kekurangan zat besi.', 22000.00, 80, '1782735818839-238785979-sangobion-id-packshot-caps.png', '2026-06-29 12:17:52'),
(15, 3, 'Imboost Force', 'Suplemen untuk meningkatkan sistem imun tubuh agar tidak mudah terserang virus penyakit.', 45000.00, 55, '1782735862625-397619824-images.jpg', '2026-06-29 12:17:52'),
(16, 3, 'Neurobion Forte', 'Vitamin neurotropik untuk menjaga kesehatan fungsi saraf dan mengatasi kebas/kesemutan.', 38000.00, 65, '1782735894749-340261705-0e7b6d4f8f94f2485e56f6ffdc96749c.jpg', '2026-06-29 12:17:52'),
(17, 4, 'Termometer Digital Omron', 'Alat pengukur suhu tubuh digital dengan akurasi tinggi dan hasil yang cepat.', 65000.00, 25, '1782735916096-281646666-images (1).jpg', '2026-06-29 12:17:52'),
(18, 4, 'Oximeter Pulse Fingertip', 'Alat untuk mengukur kadar saturasi oksigen (SpO2) dan detak jantung lewat ujung jari.', 45000.00, 30, '1782735945788-375796139-images (2).jpg', '2026-06-29 12:17:52'),
(19, 4, 'Tensimeter Digital Beurer', 'Alat pengukur tekanan darah otomatis praktis untuk penggunaan mandiri di rumah.', 320000.00, 10, '1782735984349-812936208-images (3).jpg', '2026-06-29 12:17:52'),
(20, 5, 'Cetaphil Gentle Skin Cleanser', 'Pembersih wajah formula lembut yang cocok untuk kulit sensitif dan berjerawat.', 115000.00, 15, '1782736022071-631156216-images (4).jpg', '2026-06-29 12:17:52'),
(21, 5, 'Acnes Sebum Control Toner', 'Toner khusus untuk merawat kulit berminyak dan menyamarkan noda bekas jerawat.', 28000.00, 20, '1782736042955-371567867-images (5).jpg', '2026-06-29 12:17:52'),
(22, 5, 'Sebamed Clear Face Gel', 'Pelembab wajah berbasis gel yang membantu meredakan peradangan jerawat aktif.', 98000.00, 12, '1782736061520-435866662-images (6).jpg', '2026-06-29 12:17:52'),
(23, 6, 'Kasa Steril Onemed Box', 'Kain kasa steril berukuran 16x16cm untuk membalut luka agar terhindar dari infeksi.', 14000.00, 45, '1782736079416-699700178-images (7).jpg', '2026-06-29 12:17:52'),
(24, 6, 'Hansaplast Kain Elastis', 'Plester luka elastis untuk melindungi luka ringan dari kotoran dan bakteri.', 6000.00, 200, '1782736103154-695357017-images (8).jpg', '2026-06-29 12:17:52'),
(25, 6, 'Betadine Antiseptik Solution', 'Cairan antiseptik untuk mencegah infeksi pada luka bakar atau luka gores.', 18000.00, 90, '1782736125342-290911352-images (9).jpg', '2026-06-29 12:17:52'),
(26, 6, 'Rivanol Liquid 100ml', 'Cairan antiseptik yang digunakan untuk membersihkan dan mengompres luka terbuka.', 7000.00, 110, '1782736150510-312419023-images (10).jpg', '2026-06-29 12:17:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','dikirim','selesai') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `status`, `created_at`) VALUES
(7, 7, 60000.00, 'dikirim', '2026-06-23 16:09:04'),
(8, 7, 95000.00, 'dikirim', '2026-06-29 08:06:30'),
(9, 7, 40000.00, 'dikirim', '2026-06-29 08:10:33'),
(10, 12, 50000.00, 'selesai', '2026-06-29 11:41:31'),
(11, 12, 50000.00, 'selesai', '2026-06-29 11:47:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `medicine_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `medicine_id`, `quantity`, `price`) VALUES
(7, 7, 2, 1, 35000.00),
(8, 8, 2, 2, 35000.00),
(10, 10, 2, 1, 35000.00),
(11, 10, 6, 1, 5000.00),
(12, 11, 2, 1, 35000.00),
(13, 11, 6, 1, 5000.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `profile_picture`, `created_at`) VALUES
(7, 'admin', 'admin@gmail.com', '$2b$10$ZSVbCmCQr3OnwEGJCtu9BeTmwhjzkYbzZztlXu21acU2YXjSCSVmO', '08888', 'srengsengsawah', 'admin', '1782721930711-17259028-Cuplikan layar 2025-02-10 073117.png', '2026-06-23 15:01:39'),
(12, 'Alam', 'user@gmail.com', '$2b$10$dtZvfvjHHY95COFQH3LMxO.3kaCodY.MJd3a.ePVu12j.D6Lhr4Qq', '', '', 'user', '1782731268271-646302430-Cuplikan layar 2025-05-29 201154.png', '2026-06-29 10:58:27');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `medicine_id` (`medicine_id`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `medicine_id` (`medicine_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`);

--
-- Ketidakleluasaan untuk tabel `medicines`
--
ALTER TABLE `medicines`
  ADD CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
