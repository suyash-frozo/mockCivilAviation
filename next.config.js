/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Fix for pdfjs-dist in server-side
      config.resolve.alias = {
        ...config.resolve.alias,
        'canvas': false,
      }
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }
    return config
  },
  // Railway deployment - no standalone output needed
}

module.exports = nextConfig

