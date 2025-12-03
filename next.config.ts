import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 前端请求路径（如 /api/user）
        destination: 'http://localhost:8530/api/:path*', // 转发到后端
      },
    ];
  },
};

export default nextConfig;
