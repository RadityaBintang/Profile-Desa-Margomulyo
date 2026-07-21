import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getKategoriLayanan } from "@/lib/queries/layanan";
import { LayananForm } from "@/components/layanan/LayananForm";
import { createLayanan } from "../action";

export const metadata = {
  title: "Tambah Layanan - Desa Margomulyo",
};

export default async function TambahLayananPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login?redirectTo=/layanan/tambah");
  }

  const kategoriList = await getKategoriLayanan();

  return (
    <main className="bg-white">
      <div className="container-desa py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-wide text-blue-600">
            Kelola Layanan Publik
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Tambah Layanan Baru</h1>

          <div className="mt-8">
            <LayananForm
              kategoriList={kategoriList}
              action={createLayanan}
              submitLabel="Simpan Layanan"
            />
          </div>
        </div>
      </div>
    </main>
  );
}