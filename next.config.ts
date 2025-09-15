/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Required for static site generation with App Router
  output: 'export',
  
  // Set the base path for GitHub Pages
  basePath: isProd ? '/biometrics-simface-web' : '',
  assetPrefix: isProd ? '/biometrics-simface-web/' : '',

  images: {
    // Required for static site generation with next/image
    unoptimized: true,
  },
};

module.exports = nextConfig;