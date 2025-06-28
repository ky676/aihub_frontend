/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  // Ensure compatibility with Google App Engine
  output: 'standalone',
  // Required for API routes to work on App Engine
  experimental: {
    outputFileTracingRoot: undefined,
  }
}

module.exports = nextConfig 