'use server';
/**
 * @fileOverview An AI agent that generates a daily challenge for the knights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DailyChallengeOutputSchema = z.object({
  category: z.enum(['Riddle', 'Quick Quiz', 'Logic Puzzle', 'Lore Question']).describe("The category of the challenge."),
  title: z.string().describe("The thematic title of the challenge, e.g., 'The Sphinx's Riddle' or 'Alchemist's Quickfire Test'."),
  description: z.string().describe("A short, engaging description of the challenge for the user to solve."),
  reward: z.string().describe("The reward for completing the challenge, e.g., '150 XP'."),
});
export type DailyChallengeOutput = z.infer<typeof DailyChallengeOutputSchema>;

export async function generateDailyChallenge(): Promise<DailyChallengeOutput> {
  return generateDailyChallengeFlow();
}

const challengePrompt = ai.definePrompt({
  name: 'dailyChallengePrompt',
  input: {schema: z.void()},
  output: {schema: DailyChallengeOutputSchema},
  prompt: `You are the Kingdom's Challenge Master, responsible for creating a unique, fun, and engaging daily challenge for the knights. The challenge should be related to science (Physics, Chemistry, Biology), logic, or the lore of a fantasy kingdom.

  Generate a single daily challenge based on the output schema. Keep it concise and exciting. The reward should always be in the format of 'XXX XP'.
  `,
});

const generateDailyChallengeFlow = ai.defineFlow(
  {
    name: 'generateDailyChallengeFlow',
    inputSchema: z.void(),
    outputSchema: DailyChallengeOutputSchema,
  },
  async () => {
    const { output } = await challengePrompt();
    if (!output) {
      throw new Error("The Challenge Master is resting. No challenge could be generated.");
    }
    return output;
  }
);
