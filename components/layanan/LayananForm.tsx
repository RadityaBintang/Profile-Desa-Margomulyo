"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

const KATEGORI_BARU = "__baru__";

export type LayananFormDefaults = {
  namaLayanan?: string;
  kategori?: string;
  deskripsi?: string | null;
  persyaratan?: string | null;
  ikon?: string | null;
  tampilanBesar?: boolean;
  urutan?: number;
};

export function LayananForm({
  kategoriList,
  defaultValues,
  action,
  submitLabel,
}: {
  kategoriList: string[];
  defaultValues?: LayananFormDefaults;
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  const [kategoriPilihan, setKategoriPilihan] = useState(
    defaultValues?.kategori && kategoriList.includes(defaultValues.kategori)
      ? defaultValues.kategori
      : kategoriList.length > 0
        ? kategoriList[0]
        : KATEGORI_BARU
  );
  const [preview, setPreview] = useState<string | null>(defaultValues?.ikon || null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-900">
          Nama Layanan
        </label>
        <input
          type="text"
          name="namaLayanan"
          defaultValue={defaultValues?.namaLayanan}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Contoh: Akta Kelahiran"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-900">Kategori</label>
        <select
          value={kategoriPilihan}
          onChange={(event) => setKategoriPilihan(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          {kategoriList.map((kategori) => (
            <option key={kategori} value={kategori}>
              {kategori}
            </option>
          ))}
          <option value={KATEGORI_BARU}>+ Kategori baru...</option>
        </select>

        {kategoriPilihan === KATEGORI_BARU ? (
          <input
            type="text"
            name="kategori"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Nama kategori baru, contoh: ADMINDUK"
          />
        ) : (
          <input type="hidden" name="kategori" value={kategoriPilihan} />
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <input
          type="checkbox"
          name="tampilanBesar"
          defaultChecked={defaultValues?.tampilanBesar}
          className="h-4 w-4 rounded border-slate-300"
        />
        Tampilkan sebagai kartu besar (bukan grid ikon)
      </label>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-900">
          Deskripsi singkat
        </label>
        <p className="mb-1.5 text-xs text-slate-500">
          Hanya muncul di kartu kalau opsi "kartu besar" di atas dicentang.
        </p>
        <textarea
          name="deskripsi"
          defaultValue={defaultValues?.deskripsi || ""}
          rows={3}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-900">Logo / Gambar</label>
        <p className="mb-1.5 text-xs text-slate-500">
          {defaultValues ? "Kosongkan kalau tidak ingin mengganti gambar." : "JPG, PNG, atau WebP, maksimal 4MB."}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon size={28} className="text-blue-300" />
            )}
          </div>
          <input
            type="file"
            name="gambar"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="flex-1 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-900">
          Persyaratan
        </label>
        <p className="mb-1.5 text-xs text-slate-500">
          Satu syarat per baris. Kalau perlu sub-judul (misal ada beberapa
          jenis pengajuan), akhiri baris itu dengan titik dua — contoh baris
          "Pengajuan Baru:" akan otomatis jadi judul pemisah, bukan ikut
          dinomori. Baris "Catatan:" akan tampil dalam kotak highlight
          khusus.
        </p>
        <textarea
          name="persyaratan"
          defaultValue={defaultValues?.persyaratan || ""}
          rows={6}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          placeholder={"Fotokopi KTP\nFotokopi KK\nSurat pengantar RT/RW"}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-900">
          Urutan tampil
        </label>
        <p className="mb-1.5 text-xs text-slate-500">
          Angka lebih kecil tampil lebih dulu dalam kategorinya.
        </p>
        <input
          type="number"
          name="urutan"
          defaultValue={defaultValues?.urutan ?? 0}
          className="w-40 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          {submitLabel}
        </button>
        <Link
          href="/layanan"
          className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}