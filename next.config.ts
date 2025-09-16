/** @type {import('next').NextConfig} */
import type { Configuration as WebpackConfiguration } from 'webpack';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'Biometrics-SimFace-Web';

const nextConfig = {
  // Required for static site generation with App Router
  output: 'export',
  
  
  // Set the base path for GitHub Pages
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',

  images: {
    // Required for static site generation with next/image
    unoptimized: true,
  },

   webpack: (
    config: WebpackConfiguration,
    { isServer }: { isServer: boolean }
  ) => {
    // Add a rule to handle wasm files
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Don't handle server-side dependencies on the client
    if (!isServer) {
      if (!config.resolve) {
        config.resolve = {};
      }
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;