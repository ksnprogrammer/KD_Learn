'use server';
/**
 * @fileOverview AI-assisted tool to help the King forge Knowledge Dragons from raw topics.
 *
 * - createModuleFromDescription - A function that handles the dragon creation process.
 * - CreateModuleInput - The input type for the createModuleFromDescription function.
 * - CreateModuleOutput - The return type for the createModulefromdescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateModuleInputSchema = z.object({
  topicDescription: z.string().describe('The raw essence of the topic from which to forge a Knowledge Dragon.'),
  examLevel: z.enum(['Grade 5 Scholarship', 'O/L', 'A/L']).describe('The target exam level for this module.'),
});
export type CreateModuleInput = z.infer<typeof CreateModuleInputSchema>;

const LessonSectionSchema = z.object({
  title: z.string().describe("The title of this lesson section."),
  content: z.string().describe("The detailed content for this lesson section, written in Markdown format."),
});

const QuizQuestionSchema = z.object({
  question: z.string().describe("The text of the quiz question."),
  options: z.array(z.string()).describe("An array of 4 potential answers."),
  correctAnswer: z.string().describe("The correct answer from the options array."),
  explanation: z.string().describe("A brief explanation for why the correct answer is right.")
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const ResourceSuggestionSchema = z.object({
  title: z.string().describe("The title of the suggested resource (e.g., book, website, video)."),
  description: z.string().describe("A brief description of why this resource is useful."),
  type: z.enum(['video', 'article', 'book', 'interactive']).describe("The type of the resource.")
});

const CreateModuleOutputSchema = z.object({
  lessonOutline: z.array(LessonSectionSchema).describe("A detailed Dragon's Anatomy (Lesson Outline) for the topic, broken into sections. Should contain at least 3-5 sections."),
  quizQuestions: z.array(QuizQuestionSchema).describe("A Trial by Fire (Quiz Questions) of 5 questions to test a knight's mettle. Each question should have multiple choices."),
  resourceSuggestions: z.array(ResourceSuggestionSchema).describe("A list of 3-4 Ancient Tomes (Resource Suggestions) for further study."),
  imageDataUri: z.string().describe("A generated image for the module, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type CreateModuleOutput = z.infer<typeof CreateModuleOutputSchema>;

export async function createModuleFromDescription(input: CreateModuleInput): Promise<CreateModuleOutput> {
  return createModuleFromDescriptionFlow(input);
}

const modulePrompt = ai.definePrompt({
  name: 'createModulePrompt',
  input: {schema: CreateModuleInputSchema},
  output: {schema: z.object({
    lessonOutline: z.array(LessonSectionSchema),
    quizQuestions: z.array(QuizQuestionSchema),
    resourceSuggestions: z.array(ResourceSuggestionSchema),
    imagePrompt: z.string().describe("A concise, descriptive prompt for an image generator to create a fantasy art style digital painting. The prompt should capture the essence of the topic in a single, evocative sentence. For example: 'A glowing, intricate network of energy flowing through a mythical biological cell' or 'A ghostly knight dropping an apple from a celestial tree'.")
  })},
  prompt: `You are a wise and ancient Wizard, tasked by the King to forge Knowledge Dragons from raw topics for the knights of the realm in Sri Lanka.

  Based on the provided topic description, you will generate the core components of a Knowledge Dragon in a structured format. The content must be comprehensive and perfectly tailored for a Sri Lankan student preparing for the {{{examLevel}}} examination. You will also generate a prompt to create an epic, fantasy-style image that represents the topic.

  Topic Description: {{{topicDescription}}}

  Forge the output as a JSON object that strictly matches the sacred schema provided.
  - The lessonOutline should be a detailed breakdown of the topic into logical sections.
  - The quizQuestions should be challenging multiple-choice questions that test understanding, not just recall. Provide a brief explanation for each correct answer.
  - The resourceSuggestions should be a curated list of high-quality, relevant materials.
  - The imagePrompt should be a simple, single-sentence description for an image generator.

  {{#json outputSchema}}
  Now, forge the Knowledge Dragon!
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
    // Generate the text content and the image prompt
    const { output: moduleContent } = await modulePrompt(input);
    if (!moduleContent) {
      throw new Error("Failed to generate module content.");
    }

    // Generate the image
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: moduleContent.imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error("Failed to generate module image.");
    }
    
    return {
      lessonOutline: moduleContent.lessonOutline,
      quizQuestions: moduleContent.quizQuestions,
      resourceSuggestions: moduleContent.resourceSuggestions,
      imageDataUri: media.url,
    };
  }
);
