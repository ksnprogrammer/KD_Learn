
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
  serverExternalPackages: ['@opentelemetry/instrumentation', 'handlebars', 'dotprompt', 'genkit', '@genkit-ai/core', '@genkit-ai/next', '@genkit-ai/googleai', 'mongodb', 'mongoose'],
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    NEXT_PUBLIC_WHATSAPP_CHANNEL_URL: process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL,
  },
};

export default nextConfig;
