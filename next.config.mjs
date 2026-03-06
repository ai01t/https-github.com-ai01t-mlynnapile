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
    }
  },
}

export default nextConfig
