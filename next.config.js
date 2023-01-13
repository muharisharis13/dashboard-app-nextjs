const nextConfig = {
  reactStrictMode: true,
  fallback: false,
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
