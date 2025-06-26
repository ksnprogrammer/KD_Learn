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

  Based on the provided topic description, you will generate the core components of a Knowledge Dragon in a structured format. The content should be comprehensive and suitable for advanced high school level students (A/L).

  Topic Description: {{{topicDescription}}}

  Forge the output as a JSON object that strictly matches the sacred schema provided.
  - The lessonOutline should be a detailed breakdown of the topic into logical sections.
  - The quizQuestions should be challenging multiple-choice questions that test understanding, not just recall. Provide a brief explanation for each correct answer.
  - The resourceSuggestions should be a curated list of high-quality, relevant materials.

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
    const {output} = await prompt(input);
    return output!;
  }
);
