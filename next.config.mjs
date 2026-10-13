/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Staré samostatné adresy sekcí a duplikáty úvodní stránky vedou rovnou
  // na příslušnou sekci webu (Google je pak nezobrazuje jako zvláštní stránky).
  async redirects() {
    const sections = [
      ["", "/studio", "studio"],
      ["", "/vybaveni", "equipment"],
      ["", "/kontakt", "contact"],
      ["", "/lokalita", "location"],
      ["", "/onas", "place"],
      ["", "/spoluprace", "contact"],
      ["", "/faq", "contact"],
      ["/en", "/en/studio", "studio"],
      ["/en", "/en/equipment", "equipment"],
      ["/en", "/en/contact", "contact"],
      ["/en", "/en/location", "location"],
      ["/en", "/en/about", "place"],
      ["/en", "/en/collaboration", "contact"],
      ["/en", "/en/faq", "contact"],
      ["/de", "/de/studio", "studio"],
      ["/de", "/de/ausrustung", "equipment"],
      ["/de", "/de/kontakt", "contact"],
      ["/de", "/de/lage", "location"],
      ["/de", "/de/uber-uns", "place"],
      ["/de", "/de/zusammenarbeit", "contact"],
      ["/de", "/de/faq", "contact"],
    ]
    return [
      ...sections.map(([home, source, section]) => ({
        source,
        destination: `${home || "/"}#${section}`,
        permanent: true,
      })),
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/mlynnapile.html", destination: "/", permanent: true },
      { source: "/en/index.html", destination: "/en", permanent: true },
      { source: "/de/index.html", destination: "/de", permanent: true },
      { source: "/booking/index.html", destination: "/booking", permanent: true },
      { source: "/en/booking/index.html", destination: "/en/booking", permanent: true },
      { source: "/de/buchung/index.html", destination: "/de/buchung", permanent: true },
      { source: "/historie/index.html", destination: "/historie", permanent: true },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Route the homepage locales to the restored static snapshot.
        {
          source: "/",
          destination: "/mlynnapile.html",
        },
        {
          source: "/en",
          destination: "/en/index.html",
        },
        {
          source: "/de",
          destination: "/de/index.html",
        },
      ],
      // CV Studio je staticky vyexportovaná aplikace v public/jindra/cvapp.
      // afterFiles: skutečné soubory (JS, CSS, fonty) se servírují napřímo,
      // sem spadnou jen adresy stránek, které si musí najít svůj index.html.
      afterFiles: [
        {
          source: "/jindra/cvapp",
          destination: "/jindra/cvapp/index.html",
        },
        {
          source: "/jindra/cvapp/:path*",
          destination: "/jindra/cvapp/:path*/index.html",
        },
        // Keramika Kampanela — statická ukázka v public/jindra/kampanela
        {
          source: "/jindra/kampanela",
          destination: "/jindra/kampanela/index.html",
        },
      ],
    }
  },
}

export default nextConfig
