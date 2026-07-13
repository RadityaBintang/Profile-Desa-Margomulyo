import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Login Admin - Website Profil Desa",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  // Kalau sudah login, tidak perlu lihat form login lagi.
  const session = await getAdminSession();
  if (session) {
    redirect("/");
  }

  const { redirectTo } = await searchParams;

  return (
    <main className="login-page">
      <div className="container-desa">
        <div className="login-card">
          <p className="activity-form-label">AREA TERBATAS</p>
          <h1 className="login-title">Login Admin</h1>
          <p className="login-description">
            Halaman ini khusus untuk admin pengelola website Desa Margomulyo.
            Masuk untuk mengelola kegiatan, produk hukum, dan data desa lainnya.
          </p>

          <LoginForm redirectTo={redirectTo || "/"} />
        </div>
      </div>
    </main>
  );
}
