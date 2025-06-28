/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  // Remove standalone output for App Engine
  trailingSlash: false,
}

module.exports = nextConfig 