/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // msw/browser는 브라우저에서만 동작하므로 서버 번들에서는 제외한다.
    if (isServer) {
      config.resolve.alias = { ...config.resolve.alias, 'msw/browser': false };
    }
    return config;
  },
};

export default nextConfig;
