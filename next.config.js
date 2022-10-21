/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
}

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

function withAnalyzer(config) {
  return process.env.ANALYZE
  ? require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === '1'
  })(config)
  : config
}


module.exports = withAnalyzer(withMDX(nextConfig))
