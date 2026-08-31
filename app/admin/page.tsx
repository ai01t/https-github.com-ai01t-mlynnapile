import type { Metadata } from "next"
import { getServerSession } from "next-auth"

import { authOptions, isAdminEmail, isGoogleLoginConfigured } from "@/lib/auth"
import AdminClient from "./admin-client"
import AdminSignIn from "./sign-in"

export const metadata: Metadata = {
  title: "Administrace | Mlýn na Pile",
  robots: { index: false, follow: false },
}

// Bez přihlášení se editor vůbec nevykreslí — rozhoduje se na serveru,
// takže se k němu nedá dostat obejitím prohlížeče.
export default async function AdminPage() {
  if (!isGoogleLoginConfigured) {
    return <AdminClient allowPasswordFallback />
  }

  const session = await getServerSession(authOptions)
  if (!isAdminEmail(session?.user?.email)) {
    return <AdminSignIn />
  }

  return <AdminClient signedInAs={session?.user?.email ?? undefined} />
}
