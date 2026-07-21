import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getKategoriLayanan, getLayananById } from "@/lib/queries/layanan";
import { LayananForm } from "@/components/layanan/LayananForm";
import { updateLayanan } from "../../action";

export const metadata = {
  title: "Edit Layanan - Desa Margomulyo",
};

export default async function EditLayananPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  const session = await getAdminSession();

  if (!session) {
    redirect(`/login?redirectTo=/layanan/${id}/edit`);
  }

  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const [layanan, kategoriList] = await Promise.all([
    getLayananById(numericId),
    getKategoriLayanan(),
  ]);

  if (!layanan) {
    notFound();
  }

  const updateLayananById = updateLayanan.bind(null, numericId);

  return (
    <main className="bg-white">
      <div className="container-desa py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-wide text-blue-600">
            Kelola Layanan Publik
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Edit Layanan: {layanan.namaLayanan}
          </h1>

          <div className="mt-8">
            <LayananForm
              kategoriList={kategoriList}
              defaultValues={layanan}
              action={updateLayananById}
              submitLabel="Simpan Perubahan"
            />
          </div>
        </div>
      </div>
    </main>
  );
}