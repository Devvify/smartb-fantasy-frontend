/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required in Next.js 16+ for local network development
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.10.1.11:3000"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'au.testing.smartb.com.au',
      },
      {
        protocol: 'http',
        hostname: 'media.smartb.com.au',
      },
      {
        protocol: 'https',
        hostname: 'media.smartb.com.au',
      },
    ],
  },
};

export default nextConfig;
