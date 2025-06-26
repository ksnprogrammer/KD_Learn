'use server';
/**
 * @fileOverview An AI agent that generates a report on the kingdom's content status.
 */
import {ai} from '@/ai/genkit';
import {supabase} from '@/lib/supabase';
import {z} from 'zod';

const getSubmissionStats = ai.defineTool({
  name: 'getSubmissionStats',
  description: 'Gets statistics about content submissions, such as pending, approved, and rejected counts.',
  inputSchema: z.object({}),
  outputSchema: z.object({
    pending: z.number(),
    approved: z.number(),
    rejected: z.number(),
  }),
}, async () => {
  const { count: pending, error: pErr } = await supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'Pending');
  const { count: approved, error: aErr } = await supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'Approved');
  const { count: rejected, error: rErr } = await supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'Rejected');

  if (pErr || aErr || rErr) {
    console.error(pErr || aErr || rErr);
    // In case of an error, return zero counts to avoid breaking the flow.
    return { pending: 0, approved: 0, rejected: 0 };
  }
  return {
    pending: pending || 0,
    approved: approved || 0,
    rejected: rejected || 0,
  }
});

export const KingdomReportOutputSchema = z.object({
    narrativeSummary: z.string().describe("A 2-3 paragraph narrative summary of the kingdom's content pipeline health, written in the persona of a Royal Scribe. Mention key metrics and offer strategic advice for the King."),
    keyMetrics: z.array(z.object({
        metric: z.string().describe("The name of the metric, e.g., 'Approved Quests' or 'Pending Submissions'."),
        value: z.string().describe("The value of the metric, e.g., '42'."),
        insight: z.string().describe("A brief, one-sentence insight or commentary on this metric. e.g., 'The backlog of quests requires attention.'"),
    })),
});
export type KingdomReportOutput = z.infer<typeof KingdomReportOutputSchema>;

export async function generateKingdomReport(): Promise<KingdomReportOutput> {
  return generateKingdomReportFlow();
}

const generateKingdomReportFlow = ai.defineFlow({
    name: 'generateKingdomReportFlow',
    inputSchema: z.void(),
    outputSchema: KingdomReportOutputSchema,
}, async () => {
    const { output } = await ai.generate({
        prompt: `You are the Royal Scribe, tasked with delivering a report to the King about the state of the kingdom's educational content. Use the available tools to gather data and present a comprehensive summary. Your report should be both informative and encouraging, offering insights into content creation and approval workflows.`,
        model: 'googleai/gemini-2.0-flash',
        tools: [getSubmissionStats],
        output: {
            schema: KingdomReportOutputSchema,
        },
    });
    if (!output) {
      throw new Error("The Royal Scribe returned an empty scroll. Report generation failed.");
    }
    return output;
});
