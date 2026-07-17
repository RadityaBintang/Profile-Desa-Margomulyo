export const metadata = {
  title: "Struktur Organisasi - Desa Margomulyo",
};

export default function StrukturOrganisasiPage() {
  return (
    <main className="bg-white">
      <section className="container-desa py-12">
        <div
          className="relative overflow-hidden rounded-[28px] bg-blue-700 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 92, 180, 0.72), rgba(0, 92, 180, 0.72)), url('/images/kegiatan/hero-kegiatan.jpg')",
          }}
        >
          <div className="flex min-h-[140px] flex-col items-center justify-center px-6 text-center text-white">
            <p className="text-sm font-extrabold uppercase tracking-wide">Profil Desa</p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">Struktur Organisasi</h1>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-5xl overflow-x-auto">
          <img
            src="/images/struktur-organisasi/struktur-organisasi.png"
            alt="Bagan Struktur Organisasi Desa Margomulyo"
            className="mx-auto w-full min-w-[700px]"
          />
        </div>
      </section>
    </main>
  );
}