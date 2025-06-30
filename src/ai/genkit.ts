import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

let aiInstance;

if (GEMINI_API_KEY) {
  aiInstance = genkit({
    plugins: [googleAI({ apiKey: GEMINI_API_KEY })],
    model: 'googleai/gemini-2.0-flash',
  });
} else {
  console.warn("GEMINI_API_KEY or GOOGLE_API_KEY not found. Genkit AI features will be disabled.");
  // Provide a dummy object or throw an error if Genkit is strictly required
  // For now, we'll provide a minimal object to prevent crashes
  aiInstance = {
    configure: () => {},
    flow: () => ({ run: () => { throw new Error("Genkit AI is not configured due to missing API key."); } }),
    // Add other dummy methods as needed if they are called directly
  };
}

export const ai = aiInstance;
