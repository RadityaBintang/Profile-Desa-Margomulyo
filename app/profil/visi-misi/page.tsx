import { getProfilDesa } from "@/lib/queries/profil";

const fallbackVisi =
  "Terwujudnya Masyarakat Desa Margomulyo yang Sehat, Maju, Sejahtera dan Berakhlak Mulia";

const maknaVisi = [
  "Sehat: Masyarakat yang sehat adalah masyarakat yang memiliki ketangguhan jiwa dan raga yang sehat dan kuat.",
  "Maju: Mampu mewujudkan kehidupan yang sejajar dan sederajat dengan masyarakat desa lain yang lebih maju dengan mengandalkan pada kemajuan dan kekuatan sendiri yang berbasis keunggulan lokal.",
  "Sejahtera: Bahwa diupayakan agar tercapai ketercukupan kebutuhan masyarakat secara lahir batin seperti sandang, pangan, papan, pendidikan, kesehatan, aman dan tenteram.",
  "Berakhlak mulia: Bahwa berpegang teguh pada keyakinan beragama, sehingga akan terciptanya masyarakat yang mempunyai solidaritas yang tinggi dan kepedulian terhadap sesamanya. Hidup saling menghargai dan saling tolong-menolong dalam kebaikan.",
];

const fallbackMisiIntro =
  "Hakikat Misi Desa Margomulyo merupakan turunan dari Visi Desa Margomulyo. Misi merupakan tujuan jangka lebih pendek dari visi yang akan menunjang keberhasilan tercapainya sebuah visi. Dengan kata lain Misi Desa Margomulyo merupakan penjabaran lebih operatif dari Visi. Penjabaran dari visi ini diharapkan dapat mengikuti dan mengantisipasi setiap terjadinya perubahan situasi dan kondisi lingkungan di masa yang akan datang dari usaha-usaha mencapai Visi Desa Margomulyo.";

const fallbackMisi = [
  "Memberikan motivasi kepada masyarakat untuk melaksanakan pola hidup bersih dan sehat (PHBS).",
  "Meningkatkan kualitas sumberdaya manusia (SDM) dengan berbagai pelatihan keterampilan.",
  "Menggali sumberdaya yang berpotensi ekonomi serta menyehatkan kegiatan ekonomi kemasyarakatan yang sudah berjalan.",
  "Meningkatkan sarana prasarana pembangunan yang merata di seluruh wilayah Desa Margomulyo dari segi fisik ekonomi, pendidikan, kesehatan dan kebudayaan.",
  "Mengedepankan musyawarah dalam kerjasama yang harmoni dengan seluruh komponen desa yang ada, baik bekerjasama dengan lembaga-lembaga desa maupun lembaga kemasyarakatan yang lain.",
  "Meningkatkan budaya yang jujur, harmonis saling menghormati dalam kehidupan berbangsa dan beragama.",
  "Memantapkan kehidupan masyarakat berlandaskan nilai-nilai keagamaan, kearifan lokal melalui optimalisasi kehidupan beragama dan kehidupan sosial.",
];

export default async function VisiMisiPage() {
  const profil = await getProfilDesa();

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
            <p className="text-sm font-extrabold uppercase tracking-wide">
              Profil Desa
            </p>
            <h1 className="mt-1 text-3xl font-black md:text-4xl">
              Visi & Misi
            </h1>
          </div>
        </div>

        <article className="mx-auto mt-12 max-w-5xl text-slate-700">
          <section className="mb-12">
            <h2 className="text-center text-4xl font-black text-slate-950">
              Visi
            </h2>

            <div className="mt-6 space-y-4 text-[15px] leading-7">
              <p>
                Bersamaan dengan penetapan RPJM Desa Margomulyo dirumuskan dan
                ditetapkan juga Visi Desa Margomulyo sebagai berikut:
              </p>

              <p className="font-bold text-slate-900">
                “{profil?.visi || fallbackVisi}”
              </p>

              <p>Makna:</p>

              <ol className="list-decimal space-y-2 pl-6">
                {maknaVisi.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-center text-4xl font-black text-slate-950">
              Misi
            </h2>

            <div className="mt-6 space-y-4 text-[15px] leading-7">
              <p>{fallbackMisiIntro}</p>

              {profil?.misi ? (
                <div className="whitespace-pre-line">{profil.misi}</div>
              ) : (
                <>
                  <p>
                    Misi adalah merupakan pernyataan yang menetapkan tujuan dan
                    sasaran desa yang hendak dicapai. Pernyataan misi membawa
                    desa kepada suatu fokus prioritas program yang akan
                    dilaksanakan.
                  </p>

                  <ol className="list-decimal space-y-2 pl-6">
                    {fallbackMisi.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}