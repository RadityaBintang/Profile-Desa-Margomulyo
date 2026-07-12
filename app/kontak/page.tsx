import { KontakLokasi } from "@/components/home/KontakLokasi";
import { getProfilDesa } from "@/lib/queries/profil";

export default async function KontakPage() {
  const profil = await getProfilDesa();
  return <KontakLokasi profil={profil} />;
}
