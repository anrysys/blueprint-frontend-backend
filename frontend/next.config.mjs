// next.config.mjs
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // config.module.rules.push({
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         sourceMap: false,
      //       },
      //     },
      //   ],
      // });
    }

    return config;
  },
};

export default nextConfig;