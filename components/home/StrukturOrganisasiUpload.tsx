"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";

import { updateStrukturOrganisasi } from "@/app/actions/struktur-organisasi";

type StrukturOrganisasiUploadProps = {
  imageUrl?: string | null;
  isAdmin?: boolean;
};

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function StrukturOrganisasiUpload({
  imageUrl,
  isAdmin = false,
}: StrukturOrganisasiUploadProps) {
  const router = useRouter();

  const formRef =
    useRef<HTMLFormElement | null>(null);

  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const objectUrlRef =
    useRef<string | null>(null);

  const [preview, setPreview] =
    useState<string | null>(imageUrl || null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );
      }
    };
  }, []);

  function clearObjectUrl() {
    if (!objectUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(
      objectUrlRef.current
    );

    objectUrlRef.current = null;
  }

  function handleUploadClick() {
    if (!isAdmin || isUploading) {
      return;
    }

    setError(null);
    setSuccess(null);

    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setSuccess(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        "Format gambar harus JPG, PNG, atau WebP."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError(
        "Ukuran gambar maksimal 4 MB."
      );

      event.target.value = "";
      return;
    }

    clearObjectUrl();

    const previewUrl =
      URL.createObjectURL(file);

    objectUrlRef.current = previewUrl;

    setPreview(previewUrl);

    formRef.current?.requestSubmit();
  }

  async function handleSubmit(
    formData: FormData
  ) {
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateStrukturOrganisasi(
        formData
      );

      setSuccess(
        "Struktur organisasi berhasil diperbarui."
      );

      clearObjectUrl();

      router.refresh();
    } catch (uploadError) {
      console.error(
        "Gagal mengunggah struktur organisasi:",
        uploadError
      );

      clearObjectUrl();
      setPreview(imageUrl || null);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Terjadi kesalahan saat mengunggah gambar."
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="w-full">
      {/* Form dan container gambar */}
      <form
        ref={formRef}
        action={handleSubmit}
      >
        <input
          ref={inputRef}
          type="file"
          name="strukturOrganisasi"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div
          className="
            relative min-h-[420px]
            overflow-hidden rounded-3xl
            border border-blue-100
            bg-blue-50 shadow-lg
          "
        >
          {preview ? (
            <img
              src={preview}
              alt="Struktur Organisasi Desa"
              className="
                block min-h-[420px]
                w-full object-contain p-6
              "
            />
          ) : (
            <div
              className="
                flex min-h-[420px]
                flex-col items-center
                justify-center p-8
                text-center
              "
            >
              <div
                className="
                  flex h-20 w-20
                  items-center justify-center
                  rounded-full bg-blue-100
                  text-blue-700
                "
              >
                <Upload size={38} />
              </div>

              <h3
                className="
                  mt-5 text-2xl
                  font-black text-blue-950
                "
              >
                Struktur Organisasi Desa
              </h3>

              <p
                className="
                  mt-2 max-w-md
                  text-sm leading-6
                  text-slate-500
                "
              >
                Gambar struktur organisasi belum
                tersedia.
              </p>
            </div>
          )}

          {isUploading && (
            <div
              className="
                absolute inset-0 z-10
                flex items-center
                justify-center
                bg-slate-950/45
                backdrop-blur-[2px]
              "
            >
              <div
                className="
                  flex flex-col items-center
                  rounded-2xl bg-white
                  px-7 py-5 shadow-xl
                "
              >
                <div
                  className="
                    h-9 w-9 animate-spin
                    rounded-full border-4
                    border-blue-100
                    border-t-blue-700
                  "
                />

                <p
                  className="
                    mt-3 text-sm
                    font-bold text-blue-950
                  "
                >
                  Mengunggah gambar...
                </p>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Pesan berada di luar container gambar */}
      {error && (
        <div
          className="
            mt-4 flex items-start gap-2
            rounded-xl border border-red-200
            bg-red-50 px-5 py-4
            text-sm font-semibold
            text-red-700
          "
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && !error && (
        <div
          className="
            mt-4 flex items-start gap-2
            rounded-xl border
            border-emerald-200
            bg-emerald-50 px-5 py-4
            text-sm font-semibold
            text-emerald-700
          "
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      {/* Tombol benar-benar di luar container gambar */}
      {isAdmin && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="
              inline-flex min-h-12
              items-center justify-center
              gap-2 rounded-xl
              bg-blue-700 px-8 py-3
              text-sm font-bold
              text-white shadow-md
              transition
              hover:-translate-y-0.5
              hover:bg-blue-800
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-70
              disabled:hover:translate-y-0
            "
          >
            <Upload size={18} />

            <span>
              {isUploading
                ? "Mengunggah..."
                : preview
                  ? "Ganti Struktur Organisasi"
                  : "Upload Struktur Organisasi"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}