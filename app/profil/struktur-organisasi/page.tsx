import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { StrukturOrganisasiUpload } from "@/components/home/StrukturOrganisasiUpload";

export default async function StrukturOrganisasiPage() {
  const session = await getAdminSession();
  const isAdmin = Boolean(session);

  const profil = await prisma.profilDesa.findFirst({
    orderBy: {
      id: "asc",
    },
    select: {
      strukturOrganisasi: true,
    },
  });

  return (
    <main className="min-h-screen bg-white pb-20">
      <section className="container-desa py-10">
        <div
          className="relative overflow-hidden rounded-[28px] bg-blue-700 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 92, 180, 0.72), rgba(0, 92, 180, 0.72)), url('/images/kegiatan/hero-kegiatan.jpg')",
          }}
        >
          <div className="flex min-h-[140px] flex-col items-center justify-center px-6 text-center text-white">
            <p className="text-sm font-extrabold uppercase tracking-wide">
              Profil Desa
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">
              Struktur Organisasi
            </h1>
          </div>
        </div>

        {isAdmin && (
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm font-semibold text-blue-800">
            Mode admin aktif. Kamu dapat mengupload atau mengganti gambar
            struktur organisasi desa.
          </div>
        )}

        <div className="mx-auto mt-10 max-w-5xl">
          <StrukturOrganisasiUpload
            imageUrl={profil?.strukturOrganisasi}
            isAdmin={isAdmin}
          />
        </div>
      </section>
    </main>
  );
}