/** @type {import('next').NextConfig} */

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
};

module.exports = nextConfig;