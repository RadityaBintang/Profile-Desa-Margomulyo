import { HeroVideo } from "@/components/home/HeroVideo";
import { JamPelayanan } from "@/components/home/JamPelayanan";
import { ProfilSingkat } from "@/components/home/ProfilSingkat";
import { KegiatanSection } from "@/components/home/KegiatanSection";
import { KelembagaanSection } from "@/components/home/KelembagaanSection";
import { ProdukHukumSection } from "@/components/home/ProdukHukumSection";
import { KontakLokasi } from "@/components/home/KontakLokasi";

import { getProfilDesa } from "@/lib/queries/profil";
import { getVideoProfilAktif } from "@/lib/queries/video";
import { getJamPelayanan } from "@/lib/queries/jam-pelayanan";
import { getKegiatanTerbaru } from "@/lib/queries/kegiatan";
import { getLembagaAktif } from "@/lib/queries/lembaga";
import { getProdukHukumTerbaru } from "@/lib/queries/produk-hukum";
import { getAdminSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAdminSession();
  const isAdmin = session?.role === "admin";

  const [profil, video, jamPelayanan, kegiatan, lembaga, produkHukum] =
    await Promise.all([
      getProfilDesa(),
      getVideoProfilAktif(),
      getJamPelayanan(),
      getKegiatanTerbaru(),
      getLembagaAktif(),
      getProdukHukumTerbaru(),
    ]);

  return (
    <main>
      <HeroVideo videoUrl={video?.urlVideo} />
      <JamPelayanan data={jamPelayanan} />
<ProfilSingkat profil={profil} isAdmin={isAdmin} />
      <KegiatanSection data={kegiatan} />
      <KelembagaanSection data={lembaga} isAdmin={isAdmin} />
      <ProdukHukumSection data={produkHukum} />
      <KontakLokasi profil={profil} />
    </main>
  );
}