# Deptech Stock Management

## Deptech Stock

Proyek ini terdiri dari Backend dan Frontend dengan teknologi:

Backend: NestJS

Frontend: Next.js + TailwindCSS

Database: MySQL

## ⚙️ Backend Setup (NestJS)

### 1. Masuk ke folder backend:

cd backend


### 2. Install dependencies:

npm install


### 3. Buat file .env di folder backend dengan isi berikut:

DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=   # kosongkan jika pakai default XAMPP
DATABASE_NAME=deptech_stock

JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=3600s
PORT=3001

UPLOAD_DIR=./uploads


### 4. Buat database dan import database yang ada di github sebelum menjalankan backend:

CREATE DATABASE deptech_stock;


Import file database melalui phpMyAdmin atau MySQL Workbench.

Pastikan nama database sesuai dengan .env (deptech_stock).

### J5. Jalankan backend:

npm run start:dev


#### Backend akan berjalan di:
👉 http://localhost:3001

## 🎨 Frontend Setup (Next.js + TailwindCSS)

### 1. Masuk ke folder frontend:

cd frontend


### 2. Install dependencies:

npm install


### 3. Buat file .env.local di folder frontend dengan isi berikut:

NEXT_PUBLIC_API=http://localhost:3001


### 4. Jalankan frontend:

npm run dev


#### Frontend akan berjalan di:
👉 http://localhost:3000

## 🗂️ Database

Menggunakan MySQL.

File database tersedia untuk diimport.

Nama database harus sama dengan yang ada di .env: deptech_stock.

## 👤 Akun Default untuk login :
email : admin@gmail.com
password : admin123

Bisa dibuat melalui backend endpoint /admins.

Atau menggunakan database export yang sudah disediakan.

### 📌 Catatan

Pastikan backend berjalan lebih dulu sebelum membuka frontend.

Semua file upload akan disimpan di folder: backend/uploads.

JWT digunakan untuk autentikasi.
