/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Ensure trailing slashes are not added for clean URLs
  trailingSlash: false,
  // Powered by header removed for security
  poweredByHeader: false,
}

export default nextConfig
