/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  // Try to make API routes work on Azure
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig 