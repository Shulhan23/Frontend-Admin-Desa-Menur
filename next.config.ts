/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/laravel-api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
      {
        source: '/storage/:path*',
        destination: 'http://localhost:8000/storage/:path*',
      },
    ]
  },
}

module.exports = nextConfig
