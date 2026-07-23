import { Mail, MapPin, Phone } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

type Profil = {
  alamat: string | null;
  email: string | null;
  telepon: string | null;
  mapsEmbed: string | null;
};

const DEFAULT_MAPS_EMBED = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.0651546328263!2d112.2633834089792!3d-8.196191691801497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78bfdcc52187ab%3A0x37efc3ac0c0ac26d!2sKantor%20Desa%20Margomulyo%20Panggungrejo%20Blitar!5e0!3m2!1sid!2sid!4v1783845754327!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

export function KontakLokasi({ profil }: { profil: Profil | null }) {
  const mapsEmbed = profil?.mapsEmbed || DEFAULT_MAPS_EMBED;

  return (
    <section className="py-20">
      <div className="container-desa">
        <SectionTitle title="Kontak & Lokasi" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900">
              Kontak Kami
            </h3>

            <div className="mt-6 grid gap-4 text-slate-600">
              <p className="flex gap-3">
                <MapPin className="shrink-0 text-blue-600" />
                <span>
                  {profil?.alamat ||
                    "Kantor Desa Margomulyo Panggungrejo Blitar"}
                </span>
              </p>

              <p className="flex gap-3">
                <Phone className="shrink-0 text-blue-600" />
                <span>{profil?.telepon || "(+62) 816-1545-3303"}</span>
              </p>

              <p className="flex gap-3">
                <Mail className="shrink-0 text-blue-600" />
                <span>{profil?.email || "-"}</span>
              </p>
            </div>
          </div>

          <div className="min-h-80 overflow-hidden rounded-3xl bg-blue-100 shadow-sm">
            <div
              className="maps-embed h-full min-h-80 w-full"
              dangerouslySetInnerHTML={{ __html: mapsEmbed }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}