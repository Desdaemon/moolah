/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
}

module.exports = process.env.ANALYZE
  ? require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === '1'
  })(nextConfig)
  : nextConfig
