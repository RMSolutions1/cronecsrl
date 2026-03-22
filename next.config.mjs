/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.BUILD_FTP === "1" ? { output: "export" } : {}),
  turbopack: { root: process.cwd() },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
    unoptimized: true,
  },
  // Con output: "export" los headers no se aplican; evitamos el warning no definiéndolos.
  ...(process.env.BUILD_FTP !== "1"
    ? {
        async headers() {
          return [
            {
              source: '/images/:path*',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
          ]
        },
      }
    : {}),
}

export default nextConfig
