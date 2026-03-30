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
          const securityHeaders = [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(self)'
            },
          ]

          return [
            {
              source: '/:path*',
              headers: securityHeaders,
            },
            {
              source: '/images/:path*',
              headers: [
                ...securityHeaders,
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
              ],
            },
            {
              source: '/_next/static/:path*',
              headers: [
                ...securityHeaders,
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
              ],
            },
          ]
        },
      }
    : {}),
}

export default nextConfig
