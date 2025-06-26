'use server';
/**
 * @fileOverview AI-assisted tool to help educators generate lesson outlines, quiz questions, and resource suggestions from topic descriptions.
 *
 * - createModuleFromDescription - A function that handles the module creation process.
 * - CreateModuleInput - The input type for the createModuleFromDescription function.
 * - CreateModuleOutput - The return type for the createModuleFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateModuleInputSchema = z.object({
  topicDescription: z.string().describe('The description of the topic for which to generate a learning module.'),
});
export type CreateModuleInput = z.infer<typeof CreateModuleInputSchema>;

const CreateModuleOutputSchema = z.object({
  lessonOutline: z.string().describe('A detailed lesson outline for the topic.'),
  quizQuestions: z.string().describe('A set of quiz questions to assess understanding of the topic.'),
  resourceSuggestions: z.string().describe('A list of suggested resources for further learning on the topic.'),
});
export type CreateModuleOutput = z.infer<typeof CreateModuleOutputSchema>;

export async function createModuleFromDescription(input: CreateModuleInput): Promise<CreateModuleOutput> {
  return createModuleFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createModulePrompt',
  input: {schema: CreateModuleInputSchema},
  output: {schema: CreateModuleOutputSchema},
  prompt: `You are an AI assistant designed to help educators create learning modules quickly.

  Based on the provided topic description, generate a lesson outline, quiz questions, and resource suggestions.

  Topic Description: {{{topicDescription}}}

  {{#json outputSchema}}
  Format your output as a JSON object that matches this schema.
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
