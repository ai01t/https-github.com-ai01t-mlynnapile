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
