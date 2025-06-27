'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/create-module-from-description.ts';
import '@/ai/flows/create-story-flow.ts';
import '@/ai/flows/generate-kingdom-report.ts';
import '@/ai/flows/generate-audio-flow.ts';
import '@/ai/flows/generate-daily-challenge.ts';
import '@/ai/flows/grade-daily-challenge.ts';
import '@/ai/flows/generate-team-war-report.ts';
