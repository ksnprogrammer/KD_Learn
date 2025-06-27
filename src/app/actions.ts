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
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

const DB_NOT_CONFIGURED_ERROR = { success: false, error: 'Database not configured. Please check your .env file.' };
const DB_NOT_CONFIGURED_ERROR_WITH_DATA = { ...DB_NOT_CONFIGURED_ERROR, data: [] };

export async function login(formData: FormData) {
  if (!isSupabaseConfigured) {
    return redirect('/login?message=Database is not configured by the administrator.');
  }

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
  if (!isSupabaseConfigured) {
    return redirect('/register?message=Database is not configured by the administrator.');
  }
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const examLevel = formData.get('examLevel') as string;
  const gender = formData.get('gender') as string;
  const phone = formData.get('phone') as string;
  const nic = formData.get('nic') as string;

  const maleAvatarUrl = "https://placehold.co/400x400.png";
  const femaleAvatarUrl = "https://placehold.co/400x400.png";
  
  const avatarUrl = gender === 'male' ? maleAvatarUrl : femaleAvatarUrl;
  
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
        role: 'knight',
        avatar_url: avatarUrl,
        avatar_hint: gender === 'male' ? 'male knight fantasy' : 'female knight fantasy',
        phone: phone,
        nic: nic,
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
  if (!isSupabaseConfigured) {
    return redirect('/');
  }
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR;
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR;
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR;
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
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

export async function createPost(content: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
   if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR;
   if (!content.trim()) {
    return { success: false, error: 'Post content cannot be empty.' };
  }

  const cookieStore = cookies();
  const supabaseServer = createServerClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }
  
  const author_name = user.user_metadata?.name || 'Knight';
  const author_avatar = user.user_metadata?.avatar_url || 'https://placehold.co/100x100.png';

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
    revalidatePath('/dashboard');
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
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
  if (!isSupabaseConfigured || !supabase) return { ...DB_NOT_CONFIGURED_ERROR, data: undefined };
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

export async function getSignedUrl(fileName: string, fileType: string) {
    if (!isSupabaseConfigured || !supabase) {
        return { success: false, error: 'Database not configured.' };
    }
    const cookieStore = cookies();
    const supabaseServer = createServerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
        return { success: false, error: 'User not authenticated.' };
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filePath = `receipts/${user.id}/${Date.now()}-${cleanFileName}`;

    const { data, error } = await supabase.storage
        .from('receipts')
        .createSignedUploadUrl(filePath);

    if (error) {
        console.error('Error creating signed URL:', error);
        return { success: false, error: 'Could not create upload URL.' };
    }
    
    const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(data.path);

    return { success: true, data: { signedUrl: data.path, publicUrl } };
}

export async function submitPaymentForReview(
  userName: string, 
  paymentType: string, 
  amount: number,
  receiptUrl: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR;
  try {
    const { error } = await supabase
      .from('payments')
      .insert([
        { 
          user_name: userName, 
          payment_type: paymentType,
          amount,
          status: 'Pending',
          receipt_url: receiptUrl,
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
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
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR;
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
  if (!isSupabaseConfigured) {
    if (!supabase) return { success: false, error: 'Database not configured.' };
    return DB_NOT_CONFIGURED_ERROR;
  };
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

export async function updateUserPublicProfile(name: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) return DB_NOT_CONFIGURED_ERROR;
  if (!name.trim()) {
    return { success: false, error: 'Knight Name cannot be empty.' };
  }

  const cookieStore = cookies();
  const supabase = createServerClient({ cookies: () => cookieStore });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  const { error } = await supabase.auth.updateUser({
    data: { name: name.trim() }
  });

  if (error) {
    console.error('Update user error:', error);
    return { success: false, error: 'Could not update profile. Please try again.' };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard');

  return { success: true };
}


// --- Dynamic Stats Actions ---

const XP_PER_LEVEL = 1000;
const calculateLevel = (xp: number) => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
};
const calculateProgress = (xp: number) => {
    return (xp % XP_PER_LEVEL) / (XP_PER_LEVEL / 100);
};

const defaultStats = { xp: 0, level: 1, progress: 0, questsCompleted: 0, rank: 'N/A', activeStreak: 0 };

export async function getUserStats() {
    if (!isSupabaseConfigured || !supabase) return { success: false, error: DB_NOT_CONFIGURED_ERROR.error, data: defaultStats };
    
    const cookieStore = cookies();
    const supabaseServer = createServerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) return { success: false, error: 'User not authenticated.', data: defaultStats };

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        if (profileError?.code !== 'PGRST116') { // Ignore "No rows found"
            console.error('Profile fetch error:', profileError?.message);
        }
        return { success: true, data: defaultStats };
    }

    const xp = profile.xp || 0;
    const level = calculateLevel(xp);
    const progress = calculateProgress(xp);

    const { count: questsCompleted, error: questsError } = await supabase
        .from('quest_completions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
    
    if (questsError) console.error('Quests completed fetch error:', questsError.message);

    const { data: rankedUsers, error: rankError } = await supabase
        .from('profiles')
        .select('id')
        .order('xp', { ascending: false });

    if (rankError) console.error('Rank fetch error:', rankError.message);

    const rank = rankedUsers ? rankedUsers.findIndex(p => p.id === user.id) + 1 : 0;

    return {
        success: true,
        data: {
            xp,
            level,
            progress,
            questsCompleted: questsCompleted || 0,
            rank: rank > 0 ? rank : 'N/A',
            activeStreak: 12, // Static for now
        }
    };
}


export async function getLeaderboard() {
    if (!isSupabaseConfigured || !supabase) return { success: false, error: DB_NOT_CONFIGURED_ERROR.error, data: [] };

    const { data, error } = await supabase
        .rpc('get_leaderboard');

    if (error) {
        console.error('Leaderboard fetch error:', error.message);
        return { success: false, error: 'Could not fetch leaderboard data.', data: [] };
    }

    return { success: true, data: data.map((profile: any) => ({
        ...profile,
        avatar: profile.avatar_url || 'https://placehold.co/100x100.png',
        hint: profile.avatar_hint || 'knight portrait'
    })) };
}

export async function recordQuestCompletion(submissionId: number, score: number, totalQuestions: number) {
     if (!isSupabaseConfigured || !supabase) return { success: false, error: DB_NOT_CONFIGURED_ERROR.error };

    const cookieStore = cookies();
    const supabaseServer = createServerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) return { success: false, error: 'User not authenticated.' };

    const { data: existingCompletion, error: checkError } = await supabase
        .from('quest_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('submission_id', submissionId)
        .maybeSingle();

    if (checkError) {
        console.error("Error checking completion:", checkError.message);
        return { success: false, error: "Could not verify quest completion." };
    }

    if (existingCompletion) {
        return { success: true, message: "Quest already completed." };
    }

    const xpGained = score * 50;

    const { error: rpcError } = await supabase.rpc('award_xp', { user_id_in: user.id, xp_to_add: xpGained });

    if (rpcError) {
        console.error("Error awarding XP:", rpcError.message);
        return { success: false, error: "Could not award experience." };
    }

    const { error: insertError } = await supabase
        .from('quest_completions')
        .insert({
            user_id: user.id,
            submission_id: submissionId,
            score: score,
            total_questions: totalQuestions,
        });
    
    if (insertError) {
        console.error("Error recording quest completion:", insertError.message);
        return { success: false, error: "Could not record quest completion." };
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');
    return { success: true, xpGained };
}
