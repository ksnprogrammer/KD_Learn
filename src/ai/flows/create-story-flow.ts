'use server';
/**
 * @fileOverview A story generation AI agent for the kingdom.
 *
 * - createStory - A function that handles the story creation process.
 * - CreateStoryInput - The input type for the createStory function.
 * - CreateStoryOutput - The return type for the createStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateStoryInputSchema = z.object({
  prompt: z.string().describe('A prompt or a few keywords to inspire the story.'),
});
export type CreateStoryInput = z.infer<typeof CreateStoryInputSchema>;

const CreateStoryOutputSchema = z.object({
  title: z.string().describe("The title of the generated story."),
  story: z.string().describe("The full text of the generated story, written in Markdown format."),
  imageDataUri: z.string().describe("A generated image for the story, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type CreateStoryOutput = z.infer<typeof CreateStoryOutputSchema>;

export async function createStory(input: CreateStoryInput): Promise<CreateStoryOutput> {
  return createStoryFlow(input);
}

const storyPrompt = ai.definePrompt({
  name: 'createStoryPrompt',
  input: {schema: CreateStoryInputSchema},
  output: {schema: z.object({
    title: z.string().describe("The title of the generated story."),
    story: z.string().describe("The full text of the generated story, written in Markdown format."),
    imagePrompt: z.string().describe("A concise, descriptive prompt for an image generator that captures the essence of the story in a single sentence. For example: 'A lone knight standing on a cliff overlooking a kingdom with two moons'.")
  })},
  prompt: `You are the Royal Storyteller of the Kingdom of KingDragons. Your task is to weave epic tales of bravery, knowledge, and adventure to inspire the knights of the realm.

  Based on the user's prompt, write a short, engaging story (3-4 paragraphs) that fits the fantasy and educational theme of the kingdom.

  User's Prompt: {{{prompt}}}

  Generate the story with a compelling title. Also, create a descriptive prompt for an image generator that visually summarizes the story.
  `,
});

const createStoryFlow = ai.defineFlow(
  {
    name: 'createStoryFlow',
    inputSchema: CreateStoryInputSchema,
    outputSchema: CreateStoryOutputSchema,
  },
  async input => {
    // Generate the story and the image prompt
    const { output: storyOutput } = await storyPrompt(input);
    if (!storyOutput) {
      throw new Error("Failed to generate story content.");
    }

    // Generate the image
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: storyOutput.imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error("Failed to generate story image.");
    }
    
    return {
      title: storyOutput.title,
      story: storyOutput.story,
      imageDataUri: media.url,
    };
  }
);
