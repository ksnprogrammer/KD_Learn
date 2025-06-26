'use server';
/**
 * @fileOverview AI-assisted tool to help the King forge Knowledge Dragons from raw topics.
 *
 * - createModuleFromDescription - A function that handles the dragon creation process.
 * - CreateModuleInput - The input type for the createModuleFromDescription function.
 * - CreateModuleOutput - The return type for the createModuleFromdescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateModuleInputSchema = z.object({
  topicDescription: z.string().describe('The raw essence of the topic from which to forge a Knowledge Dragon.'),
});
export type CreateModuleInput = z.infer<typeof CreateModuleInputSchema>;

const CreateModuleOutputSchema = z.object({
  lessonOutline: z.string().describe("A detailed Dragon's Anatomy (Lesson Outline) for the topic."),
  quizQuestions: z.string().describe('A Trial by Fire (Quiz Questions) to test a knight\'s mettle.'),
  resourceSuggestions: z.string().describe('A list of Ancient Tomes (Resource Suggestions) for further study.'),
});
export type CreateModuleOutput = z.infer<typeof CreateModuleOutputSchema>;

export async function createModuleFromDescription(input: CreateModuleInput): Promise<CreateModuleOutput> {
  return createModuleFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createModulePrompt',
  input: {schema: CreateModuleInputSchema},
  output: {schema: CreateModuleOutputSchema},
  prompt: `You are a wise and ancient Wizard, tasked by the King to forge Knowledge Dragons from raw topics for the knights of the realm.

  Based on the provided topic description, you will generate the core components of a Knowledge Dragon.

  Topic Description: {{{topicDescription}}}

  {{#json outputSchema}}
  Forge the output as a JSON object that matches this sacred schema.
  {{/json}}
  `,
});

const createModuleFromDescriptionFlow = ai.defineFlow(
  {
    name: 'createModuleFromDescriptionFlow',
    inputSchema: CreateModuleInputSchema,
    outputSchema: CreateModuleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
