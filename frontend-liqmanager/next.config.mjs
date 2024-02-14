/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logos.covalenthq.com',
        port: '',
        pathname: '/tokens/**',
      },
    ],
  },
}

export default nextConfig
