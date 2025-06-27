import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This helps Next.js and Vercel correctly bundle Genkit's server-side dependencies.
  serverExternalPackages: ['@opentelemetry/instrumentation', 'handlebars', 'dotprompt'],
};

export default nextConfig;
