
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
  serverExternalPackages: ['@opentelemetry/instrumentation', 'handlebars', 'dotprompt', 'genkit', '@genkit-ai/core', '@genkit-ai/next', '@genkit-ai/googleai'],
};

export default nextConfig;
