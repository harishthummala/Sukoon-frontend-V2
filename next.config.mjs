/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VITE_GOOGLE_CLIENT_ID:
      process.env.VITE_GOOGLE_CLIENT_ID ||
      '772681843196-dqudmnoc3iqf2np8cjl2836enqtam0st.apps.googleusercontent.com',
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
