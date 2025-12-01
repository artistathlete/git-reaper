/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Increase API route timeout for long-running analysis
    proxyTimeout: 180000, // 3 minutes
  },
};

module.exports = nextConfig;
