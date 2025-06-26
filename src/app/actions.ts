'use server';

import { createModuleFromDescription } from '@/ai/flows/create-module-from-description';
import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';
import { createStory } from '@/ai/flows/create-story-flow';
import type { CreateStoryOutput } from '@/ai/flows/create-story-flow';
import { generateKingdomReport } from '@/ai/flows/generate-kingdom-report';
import type { KingdomReportOutput } from '@/ai/flows/generate-kingdom-report';
import { generateAudioFromText } from '@/ai/flows/generate-audio-flow';
import type { GenerateAudioOutput } from '@/ai/flows/generate-audio-flow';
import { generateDailyChallenge } from '@/ai/flows/generate-daily-challenge';
import type { DailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';
import { generateTeamWarReport } from '@/ai/flows/generate-team-war-report';
import type { TeamWarReportOutput } from '@/ai/flows/generate-team-war-report';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';


export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cookieStore = cookies();
  const supabase = createServerClient({ cookies: () => cookieStore });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const examLevel = formData.get('examLevel') as string;
  
  const cookieStore = cookies();
  const supabase = createServerClient({ cookies: () => cookieStore });

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name: name,
        exam_level: examLevel,
      },
    },
  });

  if (error) {
    console.error('Signup Error:', error);
    return redirect('/register?message=Could not authenticate user. Please try again.');
  }

  return redirect('/register?message=Check your email to continue the sign-up process.');
}

export async function logout() {
  const cookieStore = cookies();
  const supabase = createServerClient({ cookies: () => cookieStore });
  await supabase.auth.signOut();
  return redirect('/');
}


export async function generateModule(topicDescription: string, examLevel: 'Grade 5 Scholarship' | 'O/L' | 'A/L'): Promise<{
  success: boolean;
  data?: CreateModuleOutput;
  error?: string;
}> {
  if (!topicDescription) {
    return { success: false, error: 'Topic description cannot be empty.' };
  }
  if (!examLevel) {
    return { success: false, error: 'Exam level must be selected.' };
  }

  try {
    const output = await createModuleFromDescription({ topicDescription, examLevel });
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

export async function submitModuleForReview(moduleData: CreateModuleOutput, topicDescription: string, examLevel: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        { 
          topic: topicDescription, 
          writer: 'Royal Wizard', 
          status: 'Pending',
          content: moduleData,
          exam_level: examLevel,
          image_data_uri: moduleData.imageDataUri,
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

export async function getPosts(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return { success: true, data: data || [] };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch posts: ${errorMessage}` };
  }
}

export async function createPost(content: string, author_name: string, author_avatar: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
   if (!content.trim()) {
    return { success: false, error: 'Post content cannot be empty.' };
  }
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          content,
          author_name,
          author_avatar,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    };
    return { success: true, data };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to save post: ${errorMessage}` };
  }
}


export async function getApprovedModules(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('id, topic, content, exam_level, image_data_uri')
      .eq('status', 'Approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return { success: true, data: data || [] };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch approved modules: ${errorMessage}` };
  }
}

export async function getSubmissionById(id: number): Promise<{
  success: boolean;
  data?: {
    topic: string;
    content: CreateModuleOutput;
    exam_level: string;
    image_data_uri?: string;
  };
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('topic, content, exam_level, image_data_uri')
      .eq('id', id)
      .eq('status', 'Approved')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') { // "JSON object requested, but single row not found"
        return { success: false, error: 'Quest not found or not yet approved.' };
      }
      throw new Error(error.message);
    }
    if (!data) {
        return { success: false, error: 'Quest not found or not yet approved.' };
    }
    return { success: true, data: data as any };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch submission: ${errorMessage}` };
  }
}

export async function submitPaymentForReview(
  userName: string, 
  paymentType: string, 
  amount: number
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Note: receipt_url is omitted as we aren't handling file uploads yet
    const { error } = await supabase
      .from('payments')
      .insert([
        { 
          user_name: userName, 
          payment_type: paymentType,
          amount,
          status: 'Pending',
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
    return { success: false, error: `Failed to submit payment for review: ${errorMessage}` };
  }
}

export async function getPayments(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('payments')
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
    return { success: false, error: `Failed to fetch payments: ${errorMessage}` };
  }
}

export async function updatePaymentStatus(id: number, status: 'Approved' | 'Rejected'): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('payments')
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
    return { success: false, error: `Failed to update payment status: ${errorMessage}` };
  }
}

export async function generateKingdomAnalytics(): Promise<{
  success: boolean;
  data?: KingdomReportOutput;
  error?: string;
}> {
  try {
    const output = await generateKingdomReport();
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate report: ${errorMessage}` };
  }
}

export async function generateAudio(text: string): Promise<{
  success: boolean;
  data?: GenerateAudioOutput;
  error?: string;
}> {
  if (!text) {
    return { success: false, error: 'Text cannot be empty.' };
  }

  try {
    const output = await generateAudioFromText(text);
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate audio: ${errorMessage}` };
  }
}

export async function getDailyChallenge(): Promise<{
  success: boolean;
  data?: DailyChallengeOutput;
  error?: string;
}> {
  try {
    const output = await generateDailyChallenge();
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate daily challenge: ${errorMessage}` };
  }
}

export async function getTeamWarData(): Promise<{
  success: boolean;
  data?: TeamWarReportOutput;
  error?: string;
}> {
  try {
    const output = await generateTeamWarReport();
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate team war data: ${errorMessage}` };
  }
}
