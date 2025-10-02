-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Okt 2025 pada 18.27
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `deptech_stock`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id`, `first_name`, `last_name`, `email`, `password`, `dob`, `gender`, `created_at`, `updated_at`) VALUES
(1, 'Agus', 'Mars', 'agus@gmail.com', '$2b$12$JRaVwiKa08H4A.4y17ytD.wLBojdbQkn10XXV0y.nkLhdzQtRZnHC', '2001-05-23', 'M', '2025-10-02 08:12:15', '2025-10-02 16:12:19'),
(4, 'marsa', 'alan', 'marsa@gmail.com', '$2b$12$Q9eOQ2uYTIlDM9RDjLtrz.rrIDZjku5SRY/hkP4MadYWMjAYqkjUa', '2000-02-02', 'F', '2025-10-02 16:06:47', '2025-10-02 16:06:47'),
(5, 'admin', 'stok', 'admin@gmail.com', '$2b$12$gnquhfmAOlxwY3Io28FoRu.H8s07g738zQ0xHDV92shda15Lezx7O', '2000-02-02', 'M', '2025-10-02 16:20:15', '2025-10-02 16:20:15');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
