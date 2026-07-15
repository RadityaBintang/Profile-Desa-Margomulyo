import { prisma } from "@/lib/prisma";

type PerangkatItem = {
  id: number;
  nama: string;
  jabatan: string;
};

export const metadata = {
  title: "Struktur Organisasi - Desa Margomulyo",
};

export default async function StrukturOrganisasiPage() {
  const perangkat: PerangkatItem[] = await prisma.perangkatDesa.findMany({
    where: { status: "aktif" },
    orderBy: { urutan: "asc" },
    select: { id: true, nama: true, jabatan: true },
  });

  const kepalaDesa = perangkat[0];
  const sekretaris = perangkat[1];
  const stafLain = perangkat.slice(2);

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

        {perangkat.length === 0 ? (
          <p className="mt-12 text-center text-slate-500">
            Data perangkat desa belum tersedia.
          </p>
        ) : (
          <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center">
            {kepalaDesa && <OrgNode nama={kepalaDesa.nama} jabatan={kepalaDesa.jabatan} utama />}

            {sekretaris && (
              <>
                <Connector />
                <OrgNode nama={sekretaris.nama} jabatan={sekretaris.jabatan} />
              </>
            )}

            {stafLain.length > 0 && (
              <>
                <Connector />
                <div className="flex flex-wrap justify-center gap-6">
                  {stafLain.map((item) => (
                    <OrgNode key={item.id} nama={item.nama} jabatan={item.jabatan} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function Connector() {
  return <div className="my-4 h-8 w-px bg-slate-300" aria-hidden="true" />;
}

function OrgNode({
  nama,
  jabatan,
  utama = false,
}: {
  nama: string;
  jabatan: string;
  utama?: boolean;
}) {
  return (
    <div
      className={`min-w-[180px] rounded-2xl border px-6 py-4 text-center shadow-sm ${
        utama ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="font-bold text-slate-900">{nama}</p>
      <p className="text-sm text-slate-500">{jabatan}</p>
    </div>
  );
}