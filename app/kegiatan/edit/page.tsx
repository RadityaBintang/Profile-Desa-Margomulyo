import {
  notFound,
  redirect,
} from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LegacyEditKegiatanPageProps = {
  searchParams: Promise<{
    id?: string | string[];
  }>;
};

export default async function LegacyEditKegiatanPage({
  searchParams,
}: LegacyEditKegiatanPageProps) {
  const params = await searchParams;

  const rawId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const kegiatanId = Number(rawId);

  if (
    !Number.isInteger(kegiatanId) ||
    kegiatanId <= 0
  ) {
    notFound();
  }

  const session = await getAdminSession();

  if (!session) {
    const returnUrl =
      `/kegiatan/edit?id=${kegiatanId}`;

    redirect(
      `/login?redirectTo=${encodeURIComponent(
        returnUrl
      )}`
    );
  }

  const kegiatan =
    await prisma.kegiatan.findUnique({
      where: {
        id: kegiatanId,
      },
      select: {
        id: true,
        slug: true,
      },
    });

  if (!kegiatan) {
    notFound();
  }

  const activitySlug =
    kegiatan.slug || String(kegiatan.id);

  redirect(
    `/kegiatan/${encodeURIComponent(
      activitySlug
    )}/edit`
  );
}