"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const page: React.CSSProperties = {
  minHeight: "100svh",
  background: "#0c0b0f",
  color: "#f0ebe2",
  fontFamily: "'Manrope', system-ui, sans-serif",
  display: "grid",
  placeItems: "center",
  padding: "28px 22px",
}

const panel: React.CSSProperties = {
  width: "min(360px,100%)",
  border: "1px solid rgba(201,185,154,.18)",
  background: "#131117",
  padding: "28px 24px",
  textAlign: "center",
}

const button: React.CSSProperties = {
  width: "100%",
  marginTop: "20px",
  padding: "12px 16px",
  border: "1px solid rgba(201,185,154,.32)",
  background: "#f0ebe2",
  color: "#16141a",
  fontSize: ".82rem",
  fontWeight: 600,
  letterSpacing: ".02em",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45 24.5c0-1.6-.1-2.8-.4-4H24v7.5h12c-.2 2-1.5 5-4.4 7l6.8 5.3C42.4 36.6 45 31 45 24.5z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.8-5.3c-1.9 1.3-4.4 2.2-7.7 2.2-5.9 0-10.9-3.9-12.7-9.2l-7 5.4C7.9 41 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.3 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7-5.4C2.8 17.1 2 20.4 2 24s.8 6.9 2.3 9.8l7-5.4z" />
      <path fill="#EA4335" d="M24 10.5c3.3 0 5.6 1.4 6.9 2.6l5.9-5.8C33.2 4 29 2 24 2 15.4 2 7.9 7 4.3 14.2l7 5.4C13.1 14.4 18.1 10.5 24 10.5z" />
    </svg>
  )
}

function SignInPanel() {
  const params = useSearchParams()
  const failed = Boolean(params.get("error"))

  return (
    <main style={page}>
      <div style={panel}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: "1.7rem",
            margin: 0,
          }}
        >
          Administrace
        </h1>
        <p style={{ color: "rgba(240,235,226,.6)", fontSize: ".8rem", lineHeight: 1.7, margin: "12px 0 0" }}>
          Přihlaste se účtem Google. Přístup má jen povolená adresa.
        </p>

        <button type="button" style={button} onClick={() => signIn("google", { callbackUrl: "/admin" })}>
          <GoogleMark />
          Přihlásit se přes Google
        </button>

        {failed ? (
          <p style={{ color: "#e07a7a", fontSize: ".76rem", lineHeight: 1.6, marginTop: "14px" }}>
            Tento účet nemá do administrace přístup.
          </p>
        ) : null}
      </div>
    </main>
  )
}

export default function AdminSignIn() {
  return (
    <Suspense fallback={<main style={page} />}>
      <SignInPanel />
    </Suspense>
  )
}
