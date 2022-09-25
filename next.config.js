/** @type {import('next').NextConfig} */
const nextConfig = {
  // A bug with React 18 and useEffect means that strict mode
  // breaks Supabase auth.
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
