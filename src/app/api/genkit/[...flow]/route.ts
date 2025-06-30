// /src/app/api/genkit/[...flow]/route.ts
import createApiHandler from '@genkit-ai/next';

// This imports all the defined flows from your project.
// The `createApiHandler` will automatically discover and expose them.
import '@/ai/dev';

// Temporarily commented out due to persistent type errors with Genkit's createApiHandler.
// import createApiHandler from '@genkit-ai/next';
// import { NextRequest, NextResponse } from 'next/server';

// This imports all the defined flows from your project.
// The `createApiHandler` will automatically discover and expose them.
// import '@/ai/dev';

// const handler = createApiHandler();

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   return handler(req);
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   return handler(req);
// }

// Placeholder exports to satisfy Next.js API route requirements
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ message: "Genkit AI features are temporarily disabled." });
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ message: "Genkit AI features are temporarily disabled." });
}
