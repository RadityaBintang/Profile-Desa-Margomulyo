# Desa Profile Next Starter

Starter project website profil desa menggunakan Next.js, TypeScript, Tailwind CSS, Prisma, dan MySQL.

## Cara Pakai

1. Copy `.env.example` menjadi `.env`.
2. Sesuaikan `DATABASE_URL`.
3. Install dependency:

```bash
npm install
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Jalankan migrasi jika ingin membuat tabel dari schema Prisma:

```bash
npx prisma migrate dev --name init
```

6. Jalankan development server:

```bash
npm run dev
```

Buka `http://localhost:3000`.
<<<<<<< HEAD

## Fitur Login Admin

Website ini punya satu role saja: **admin**. Login dipakai untuk mengakses
halaman kelola kegiatan (tambah/edit) yang sebelumnya bisa diakses siapa saja
lewat URL langsung.

1. Tambahkan `AUTH_SECRET` di `.env` (sudah otomatis dibuatkan secara acak
   di project ini). Jangan pernah commit nilai ini ke Git, dan gunakan nilai
   yang berbeda saat deploy ke production.
2. Jalankan migrasi supaya tabel `admin` tersedia:

```bash
npx prisma migrate dev
```

3. Buat akun admin pertama (ganti password default!):

```bash
ADMIN_USERNAME=admin ADMIN_PASSWORD=passwordkuatanda npm run prisma:seed
```

4. Login lewat `http://localhost:3000/login`, atau klik tombol **Login** di
   pojok kanan navbar.

Setelah login, tombol "+ Tambah Kegiatan" dan "Edit Kegiatan" akan otomatis
muncul, dan halaman `/kegiatan/tambah` serta `/kegiatan/[slug]/edit` hanya
bisa diakses oleh admin yang sudah login (dijaga di level middleware, halaman,
maupun Server Action).

=======
>>>>>>> 393ac64900f333a9f4a2269cbf90da9c2d054f1c
