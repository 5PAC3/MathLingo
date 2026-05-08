/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // env is injected at build time by CI (Netlify/Railway)
}
export default nextConfig
