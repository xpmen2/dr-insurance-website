/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Redirigir la raíz al index.html vanilla
  async redirects() {
    return [
      {
        source: '/',
        destination: '/index.html',
        permanent: false,
      },
    ]
  },
  // Permitir que Next.js sirva archivos HTML estáticos
  trailingSlash: true,
}

module.exports = nextConfig