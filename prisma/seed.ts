/**
 * Script untuk membuat/reset akun admin.
 *
 * Cara pakai:
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD=passwordkuat123 npx tsx prisma/seed.ts
 *
 * Atau tanpa env (pakai default di bawah, WAJIB diganti setelah login pertama):
 *   npx tsx prisma/seed.ts
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const nama = process.env.ADMIN_NAMA || "Administrator";

  if (password.length < 8) {
    throw new Error("Password minimal 8 karakter. Gunakan ADMIN_PASSWORD yang lebih kuat.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: { password: hashedPassword, nama },
    create: { username, password: hashedPassword, nama },
  });

  console.log(`Admin siap dipakai -> username: "${admin.username}"`);

  if (!process.env.ADMIN_PASSWORD) {
    console.log(
      'Peringatan: password masih memakai default "admin123". Segera login lalu ganti password di database.'
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
