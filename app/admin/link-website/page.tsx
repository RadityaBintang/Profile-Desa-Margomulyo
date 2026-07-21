import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ExternalLink } from "lucide-react";
import { getAdminSession } from "@/lib/auth";

const externalLinks = [
  {
    title: "Website Perpustakaan Margomulyo",
    description: "Website Administrasi Perpustakaan Desa Margomulyo.",
    url: "https://script.google.com/macros/s/AKfycbyDi3sT-oqFu0khcIBPt-7PDwPu_2MACeMXVUbMlcrjwMJOut91nmIYgDjcpDoj9-JB/exec",
  },
  
];

export default async function LinkWebsitePage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <section className="container-desa py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <BookOpen size={30} />
            </div>

            <div>
              <p className="text-sm font-extrabold uppercase text-blue-600">
                Admin
              </p>
              <h1 className="text-3xl font-black text-slate-950">
                Link Website Lain
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Halaman khusus admin untuk menyimpan akses cepat ke website
                eksternal yang berkaitan dengan desa.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {externalLinks.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>

                  <ExternalLink
                    size={22}
                    className="shrink-0 text-blue-600 transition group-hover:translate-x-1"
                  />
                </div>

                <p className="mt-5 break-all text-sm font-semibold text-blue-700">
                  {item.url}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex rounded-full border border-blue-600 px-5 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}