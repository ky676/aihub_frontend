/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  experimental: {
    outputStandalone: false,
  },
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig 