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
