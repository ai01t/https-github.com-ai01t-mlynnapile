import type { Metadata } from "next"
import { getServerSession } from "next-auth"

import { authOptions, isAdminEmail, isGoogleLoginConfigured } from "@/lib/auth"
import AdminSignIn from "@/app/admin/sign-in"
import ChlebaAdminClient from "./admin-client"

export const metadata: Metadata = {
  title: "Chleba — úpravy | Mlýn na Pile",
  robots: { index: false, follow: false },
}

// Editor se bez přihlášení vůbec nevykreslí — rozhoduje se na serveru.
export default async function ChlebaAdminPage() {
  if (isGoogleLoginConfigured) {
    const session = await getServerSession(authOptions)
    if (!isAdminEmail(session?.user?.email)) return <AdminSignIn />
    return <ChlebaAdminClient signedInAs={session?.user?.email ?? undefined} />
  }

  // Bez klíčů od Googlu (lokální vývoj) běží editor bez přihlášení.
  return <ChlebaAdminClient />
}
