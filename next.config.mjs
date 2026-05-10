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
  experimental: {
    optimizePackageImports: ["lucide-react", "rehype-highlight", "lucide-react"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
}

export default nextConfig
