/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/laravel-api/:path*',
        destination: 'https://api.desamenur.com/:path*',
      },
      {
        source: '/storage/:path*',
        destination: 'https://api.desamenur.com/storage/:path*',
      },
    ]
  },
}

module.exports = nextConfig
