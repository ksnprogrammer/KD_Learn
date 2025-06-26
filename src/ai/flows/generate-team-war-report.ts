'use server';
/**
 * @fileOverview An AI agent that generates a dynamic report for the Team Wars.
 *
 * - generateTeamWarReport - A function that handles the report generation.
 * - TeamWarReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TeamSchema = z.object({
  name: z.string().describe("The name of the dragon team, e.g., 'Verdant Dragons' or 'Crimson Dragons'."),
  subject: z.enum(['Biology', 'Chemistry', 'Physics']).describe("The subject this team represents."),
  score: z.string().describe("The team's current score, formatted with commas, e.g., '12,450'."),
  members: z.number().describe("The number of knights on this team.")
});

const BattleHistoryItemSchema = z.object({
  id: z.number(),
  teams: z.string().describe("The names of the two teams that fought, e.g., 'Verdant Dragons vs Crimson Dragons'."),
  winner: z.string().describe("The name of the winning team."),
  date: z.string().describe("A relative date for when the battle concluded, e.g., 'Yesterday', '2 days ago'.")
});

const TeamWarReportOutputSchema = z.object({
  liveBattle: z.object({
    teamA: TeamSchema,
    teamB: TeamSchema,
    timeLeft: z.string().describe("The time remaining in the battle, e.g., '1h 15m remaining'."),
    narrative: z.string().describe("A short, exciting, one-sentence summary of the current state of the battle.")
  }),
  battleHistory: z.array(BattleHistoryItemSchema).describe("A list of 4 recent, plausible battle outcomes.")
});
export type TeamWarReportOutput = z.infer<typeof TeamWarReportOutputSchema>;

export async function generateTeamWarReport(): Promise<TeamWarReportOutput> {
  return generateTeamWarReportFlow();
}

const reportPrompt = ai.definePrompt({
  name: 'teamWarReportPrompt',
  input: {schema: z.void()},
  output: {schema: TeamWarReportOutputSchema},
  prompt: `You are the Kingdom's Battle Master, responsible for reporting on the ongoing Team Wars. The teams are the 'Verdant Dragons' (Biology), 'Crimson Dragons' (Physics), and 'Azure Dragons' (Chemistry).

  Generate a report for a *new, random, live battle* between two of these teams. Make the scores close and exciting. Also generate a plausible history of 4 recent battles. Ensure the output strictly follows the provided JSON schema.
  `,
});

const generateTeamWarReportFlow = ai.defineFlow(
  {
    name: 'generateTeamWarReportFlow',
    inputSchema: z.void(),
    outputSchema: TeamWarReportOutputSchema,
  },
  async () => {
    const { output } = await reportPrompt();
    if (!output) {
      throw new Error("The Battle Master is on a break. No report could be generated.");
    }
    return output;
  }
);
