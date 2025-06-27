'use server';
/**
 * @fileOverview An AI agent that grades a user's answer to a daily challenge.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { 
    GradeChallengeInputSchema, 
    GradeChallengeOutputSchema,
    type GradeChallengeInput,
    type GradeChallengeOutput,
} from '@/ai/schemas';

export type { GradeChallengeInput, GradeChallengeOutput };


export async function gradeDailyChallenge(input: GradeChallengeInput): Promise<GradeChallengeOutput> {
  return gradeChallengeFlow(input);
}

const gradingPrompt = ai.definePrompt({
  name: 'gradeChallengePrompt',
  input: { schema: GradeChallengeInputSchema },
  output: { schema: GradeChallengeOutputSchema },
  prompt: `You are the Kingdom's wise and fair Challenge Master. A knight has submitted an answer to your daily challenge. Your task is to grade it.

  **The Challenge:**
  - Category: {{{challenge.category}}}
  - Title: {{{challenge.title}}}
  - Problem: {{{challenge.description}}}

  **The Knight's Answer:**
  {{{userAnswer}}}

  Carefully evaluate the knight's answer.
  - If it's a riddle or logic puzzle, be flexible with wording but ensure the core logic is sound.
  - If it's a quiz or lore question, be more strict about the factual accuracy.
  - Set 'isCorrect' to true or false.
  - Provide a brief, encouraging, one-sentence explanation for your decision. For example: "Correct! That's some sharp thinking, knight!" or "A valiant effort, but not quite. The alchemist was looking for the effects of oxidation."
  `,
});

const gradeChallengeFlow = ai.defineFlow(
  {
    name: 'gradeChallengeFlow',
    inputSchema: GradeChallengeInputSchema,
    outputSchema: GradeChallengeOutputSchema,
  },
  async (input) => {
    const { output } = await gradingPrompt(input);
    if (!output) {
      throw new Error("The Challenge Master is pondering. Grading could not be completed.");
    }
    return output;
  }
);
