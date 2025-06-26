'use server';

import { createModuleFromDescription } from '@/ai/flows/create-module-from-description';
import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';

export async function generateModule(topicDescription: string): Promise<{
  success: boolean;
  data?: CreateModuleOutput;
  error?: string;
}> {
  if (!topicDescription) {
    return { success: false, error: 'Topic description cannot be empty.' };
  }

  try {
    const output = await createModuleFromDescription({ topicDescription });
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate module: ${errorMessage}` };
  }
}
