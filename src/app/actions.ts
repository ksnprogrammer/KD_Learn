'use server';

import { createModuleFromDescription } from '@/ai/flows/create-module-from-description';
import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';
import { createStory } from '@/ai/flows/create-story-flow';
import type { CreateStoryOutput } from '@/ai/flows/create-story-flow';
import { supabase } from '@/lib/supabase';

export async function generateModule(topicDescription: string): Promise<{
  success: boolean;
  data?: CreateModuleOutput;
  error?: string;
}> {
  if (!topicDescription) {
    return { success: false, error: 'Topic description cannot be empty.' };
  }

  try {
    const output = await createModuleFromDescription({ topicDescription });
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate module: ${errorMessage}` };
  }
}

export async function generateStory(prompt: string): Promise<{
  success: boolean;
  data?: CreateStoryOutput;
  error?: string;
}> {
  if (!prompt) {
    return { success: false, error: 'Prompt cannot be empty.' };
  }

  try {
    const output = await createStory({ prompt });
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate story: ${errorMessage}` };
  }
}

export async function submitModuleForReview(moduleData: CreateModuleOutput, topicDescription: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // NOTE: This assumes a 'submissions' table exists in Supabase
    // with columns: topic (text), writer (text), status (text), content (jsonb)
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        { 
          topic: topicDescription, 
          writer: 'Royal Wizard', // In a real app, this would be the logged-in user's name
          status: 'Pending',
          content: moduleData 
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    };
    return { success: true };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to submit module for review: ${errorMessage}` };
  }
}

export async function getSubmissions(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return { success: true, data: data || [] };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch submissions: ${errorMessage}` };
  }
}

export async function updateSubmissionStatus(id: number, status: 'Approved' | 'Rejected'): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return { success: true };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update submission status: ${errorMessage}` };
  }
}

export async function saveStory(storyData: CreateStoryOutput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('stories')
      .insert([
        { 
          title: storyData.title, 
          story: storyData.story,
          image_data_uri: storyData.imageDataUri,
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    };
    return { success: true };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to save story: ${errorMessage}` };
  }
}

export async function getStories(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return { success: true, data: data || [] };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch stories: ${errorMessage}` };
  }
}
