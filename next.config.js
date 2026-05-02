/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // yahoo-finance2 內含 Deno 測試檔，不能讓 webpack 打包；
    // 改成 server runtime 直接 require 即可繞過。
    serverComponentsExternalPackages: ["yahoo-finance2"],
  },
};

module.exports = nextConfig;
