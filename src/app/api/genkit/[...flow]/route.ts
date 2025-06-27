// /src/app/api/genkit/[...flow]/route.ts
import { createApiHandler } from '@genkit-ai/next';

// This imports all the defined flows from your project.
// The `createApiHandler` will automatically discover and expose them.
import '@/ai/dev';

export const { GET, POST } = createApiHandler();
