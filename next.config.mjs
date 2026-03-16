/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.BUILD_FTP === "1" ? { output: "export" } : {}),
  turbopack: { root: process.cwd() },
  
  // TypeScript y ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Advertir pero no fallar el build por errores de lint
    ignoreDuringBuilds: false,
  },
  
  // Optimización de imágenes
  images: {
    qualities: [75, 90],
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
    unoptimized: process.env.BUILD_FTP === "1",
  },
  
  // Compresión
  compress: true,
  
  // Optimizaciones de producción
  poweredByHeader: false,
  
  // Con output: "export" los headers y redirects no se aplican
  ...(process.env.BUILD_FTP !== "1"
    ? {
        // Headers de seguridad y cache
        async headers() {
          return [
            // Headers de seguridad globales
            {
              source: '/:path*',
              headers: [
                { key: 'X-DNS-Prefetch-Control', value: 'on' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
              ],
            },
            // Cache para imágenes estáticas
            {
              source: '/images/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
            // Cache para assets estáticos
            {
              source: '/_next/static/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
            // Cache para fuentes
            {
              source: '/fonts/:path*',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
          ]
        },
        
        // Redirects
        async redirects() {
          return [
            // Redirect de www a non-www
            {
              source: '/:path*',
              has: [
                {
                  type: 'host',
                  value: 'www.cronecsrl.com',
                },
              ],
              destination: 'https://cronecsrl.com/:path*',
              permanent: true,
            },
          ]
        },
      }
    : {}),
}

export default nextConfig
