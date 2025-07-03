import { genkit, type Genkit } from 'genkit'; // Import Genkit type
import { googleAI } from '@genkit-ai/googleai';
// import { z } from 'zod'; // Not strictly needed for the dummy if we use 'any'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

let aiInstance: Genkit; // Use the Genkit type

if (GEMINI_API_KEY) {
  aiInstance = genkit({
    plugins: [googleAI({ apiKey: GEMINI_API_KEY })],
    model: 'googleai/gemini-2.0-flash', // Default model
  });
} else {
  console.warn(
    'GEMINI_API_KEY or GOOGLE_API_KEY not found. Genkit AI features will be disabled. ' +
    'Flows will throw errors if called. This is expected during build if no key is set.'
  );

  const DUMMY_NAME = 'DUMMY_GENKIT_OBJECT';
  const errorMessage = (methodName: string, specificName?: string) =>
    `Genkit AI is not configured (API key missing). Cannot execute ${methodName}` +
    (specificName ? ` for ${specificName}.` : '.');

  aiInstance = {
    defineFlow: (config: any, fn: any) => {
      const name = typeof config === 'string' ? config : config.name || DUMMY_NAME;
      console.warn(`Genkit AI (dummy): Flow registered - ${name}`);
      return (() => { throw new Error(errorMessage('flow', name)); }) as any;
    },
    definePrompt: (config: any, fn: any) => {
      const name = config.name || DUMMY_NAME;
      console.warn(`Genkit AI (dummy): Prompt registered - ${name}`);
      return (async () => { throw new Error(errorMessage('prompt', name)); }) as any;
    },
    generate: async (params: any) => {
      console.error('Genkit AI (dummy): ai.generate called');
      throw new Error(errorMessage('generate'));
    },
    defineTool: (config: any, fn: any) => {
      const name = config.name || DUMMY_NAME;
      console.warn(`Genkit AI (dummy): Tool registered - ${name}`);
      return (async () => { throw new Error(errorMessage('tool', name)); }) as any;
    },
    model: (modelName: string) => {
      console.warn(`Genkit AI (dummy): ai.model('${modelName}') accessed`);
      return {
        name: modelName,
        info: { name: modelName, provider: 'dummy', label: `Dummy ${modelName}` },
        generate: async (params: any) => {
          throw new Error(errorMessage(`model(${modelName}).generate`));
        },
      } as any; // Cast to any as it's a mock model
    },
    configure: (config: any) => {
      console.warn(`Genkit AI (dummy): ai.configure() called`);
    },
    // Ensure all properties accessed on 'ai' are covered.
    // If 'ai.run' or other direct properties/methods are used, they need to be here.
    // From the flow files, it seems these are the main ones.
  } as unknown as Genkit; // Assert as Genkit, acknowledging it's a mock.
}

export const ai = aiInstance;
