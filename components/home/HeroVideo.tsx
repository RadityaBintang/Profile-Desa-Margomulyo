type HeroVideoProps = {
  videoUrl?: string | null;
};

export function HeroVideo({ videoUrl }: HeroVideoProps) {
  const embedUrl = videoUrl || "https://www.youtube.com/embed/CONTOH_VIDEO_ID";

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="container-desa grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Website Resmi Desa</p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">
            Website Profil <span className="text-blue-600">Desa Margomulyo</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Informasi resmi tentang pelayanan publik, kegiatan desa, kelembagaan, dan produk hukum desa dalam satu platform yang mudah diakses masyarakat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/kegiatan" className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Lihat Kegiatan</a>
            <a href="/produk-hukum" className="rounded-full border border-blue-600 bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">Produk Hukum</a>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-2xl shadow-blue-100">
          <div className="aspect-video overflow-hidden rounded-2xl bg-slate-900">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title="Video Profil Desa"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
