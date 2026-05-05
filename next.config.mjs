/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  // Allow HTTP API calls from HTTPS frontend
  experimental: {
    allowedDevOrigins: ['http://16.176.206.236'],
  },
};

export default nextConfig;