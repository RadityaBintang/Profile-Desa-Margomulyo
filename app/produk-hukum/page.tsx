import { ProdukHukumSection } from "@/components/home/ProdukHukumSection";
import { getSemuaProdukHukum } from "@/lib/queries/produk-hukum";

export default async function ProdukHukumPage() {
  const produkHukum = await getSemuaProdukHukum();

  return (
    <main>
      <ProdukHukumSection data={produkHukum} />
    </main>
  );
}
