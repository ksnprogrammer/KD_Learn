// /src/app/api/genkit/[...flow]/route.ts
import { genkitAPI } from '@genkit-ai/next';

// This imports all the defined flows from your project.
// The `genkitAPI` handler will automatically discover and expose them.
import '@/ai/dev';

export const { GET, POST } = genkitAPI();
