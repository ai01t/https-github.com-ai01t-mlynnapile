import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Do administrace se přihlašuje účtem Google. Povolené adresy jsou v
// ADMIN_EMAILS (oddělené čárkou); bez nastavení platí jen adresa majitele.
const DEFAULT_ADMIN_EMAILS = ["j.traxmandl@gmail.com"]

export function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS
  if (!raw) return DEFAULT_ADMIN_EMAILS
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

// Dokud nejsou v prostředí klíče od Googlu, přihlášení se nezapne a
// administrace zůstane na původním heslovém vstupu (jen ve vývoji).
export const isGoogleLoginConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin", error: "/admin" },
  callbacks: {
    // Cizí účet se nepřihlásí — ověřuje se e-mail potvrzený Googlem.
    async signIn({ profile }) {
      const verified = (profile as { email_verified?: boolean } | undefined)?.email_verified
      return verified !== false && isAdminEmail(profile?.email)
    },
    async jwt({ token }) {
      token.isAdmin = isAdminEmail(token.email)
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as { isAdmin?: boolean }).isAdmin = Boolean(token.isAdmin)
      }
      return session
    },
  },
}
