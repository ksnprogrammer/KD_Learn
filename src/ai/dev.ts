'use server';
// The dotenv package is for local development and is not needed for Vercel deployments.
// It has been removed to ensure a clean build.

import '@/ai/flows/create-module-from-description.ts';
import '@/ai/flows/create-story-flow.ts';
import '@/ai/flows/generate-kingdom-report.ts';
import '@/ai/flows/generate-audio-flow.ts';
import '@/ai/flows/generate-daily-challenge.ts';
import '@/ai/flows/grade-daily-challenge.ts';
import '@/ai/flows/generate-team-war-report.ts';
