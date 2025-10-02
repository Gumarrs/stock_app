# Deptech Stock Management

Proyek ini terdiri dari **Backend** dan **Frontend**:

- **Backend**: NestJS
- **Frontend**: Next.js + TailwindCSS
- **Database**: MySQL
- **API Default**: `http://localhost:3001`

---

1. Masuk ke folder backend:

```bash
cd backend
```
2. Install dependencies:

npm install

3. Buat file .env di folder backend dengan isi berikut:

DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=        # kosongkan jika pakai default XAMPP
DATABASE_NAME=deptech_stock

JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=3600s
PORT=3001

UPLOAD_DIR=./uploads


4. Jalankan backend:

npm run start:dev


Backend akan berjalan di http://localhost:3001

5. Frontend Setup (Next.js + TailwindCSS)

6.
7. Masuk ke folder frontend:

cd frontend

7. Install dependencies:

npm install


8. Buat file .env.local di folder frontend dengan isi berikut:

NEXT_PUBLIC_API=http://localhost:3001


9. Jalankan frontend:

npm run dev


Frontend akan berjalan di http://localhost:3000

Database

Database menggunakan MySQL.

File database bisa diunduh dan import menggunakan phpMyAdmin atau MySQL Workbench.

Pastikan nama database sama dengan yang ada di .env (deptech_stock).

Akun Default

Bisa dibuat sendiri lewat backend endpoint /admins atau sesuai database export yang diberikan.

Catatan

Pastikan backend sudah berjalan sebelum membuka frontend.

Semua file upload akan disimpan di folder backend/uploads.

JWT digunakan untuk autentikasi. Jangan ubah JWT_SECRET sembarangan.

Teknologi yang Dipakai

Backend: NestJS, MySQL, JWT, Multer (upload)

Frontend: Next.js, TailwindCSS, React
