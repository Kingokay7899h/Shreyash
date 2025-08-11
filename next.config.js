/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      // Add your domain when you deploy
    ],
    unoptimized: true, // For static export if needed
  },
  // Enable static export for deployment platforms like Netlify
  trailingSlash: true,
  // Optimize for production
  swcMinify: true,
  // Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Asset optimization
  webpack: (config, { isServer }) => {
    // Handle Three.js and other 3D libraries
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    
    // Handle shader files
    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      type: 'asset/source',
    });

    return config;
  },
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
  // Handle 3D assets
  async rewrites() {
    return [
      {
        source: '/models/:path*',
        destination: '/api/models/:path*',
      },
    ];
  },
}

module.exports = nextConfig