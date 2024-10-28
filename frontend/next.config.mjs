// next.config.js
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.module.rules.push({
          test: /react-toastify\.esm\.mjs$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                sourceMaps: false,
              },
            },
          ],
        });
      }
  
      return config;
    },
  };
  
  export default nextConfig;