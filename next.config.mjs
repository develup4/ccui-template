const nextConfig = {
  distDir: "target",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
