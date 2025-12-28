/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration for Next.js 16+
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Fallback webpack config for production builds
  webpack(config, { dev }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  // Required in Next.js 16+ for local network development
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.10.1.11:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "au.testing.smartb.com.au",
      },
      {
        protocol: "http",
        hostname: "media.smartb.com.au",
      },
      {
        protocol: "https",
        hostname: "media.smartb.com.au",
      },
    ],
  },
};

export default nextConfig;
