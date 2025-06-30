
'use server';

// Temporarily commented out Genkit-related imports due to type errors.
// import { createModuleFromDescription } from '@/ai/flows/create-module-from-description';
// import type { CreateModuleOutput } from '@/ai/flows/create-module-from-description';
// import { createStory } from '@/ai/flows/create-story-flow';
// import type { CreateStoryOutput } from '@/ai/flows/create-story-flow';
// import { generateKingdomReport } from '@/ai/flows/generate-kingdom-report';
// import type { KingdomReportOutput } from '@/ai/flows/generate-kingdom-report';
// import { generateAudioFromText } from '@/ai/flows/generate-audio-flow';
// import type { GenerateAudioOutput } from '@/ai/flows/generate-audio-flow';
import { generateDailyChallenge } from '@/ai/flows/generate-daily-challenge';
import { gradeDailyChallenge, type GradeChallengeOutput } from '@/ai/flows/grade-daily-challenge';
// import type { GradeChallengeOutput } from '@/ai/schemas';
// import { generateTeamWarReport } from '@/ai/flows/generate-team-war-report';
// import type { TeamWarReportOutput } from '@/ai/flows/generate-team-war-report';
import type { DailyChallengeOutput } from '@/ai/schemas/daily-challenge';
import { isSupabaseConfigured } from '@/lib/supabase';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

const DB_NOT_CONFIGURED_ERROR = { success: false, error: 'Database not configured. Please check your .env file.' };
const DB_NOT_CONFIGURED_ERROR_WITH_DATA = { ...DB_NOT_CONFIGURED_ERROR, data: undefined };

export async function login(formData: FormData) {
  if (!isSupabaseConfigured) {
    return redirect('/login?message=Database is not configured by the administrator.');
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createSupabaseServerClient();

  const { error } = await (await supabase).auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  return redirect('/dashboard');
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured) {
    return redirect('/register?message=Database is not configured by the administrator.');
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const examLevel = formData.get('examLevel') as string;
  const gender = formData.get('gender') as string;
  const phone = formData.get('phone') as string;
  const nic = formData.get('nic') as string;

  const requestUrl = new URL((await headers()).get('origin') as string);

  const maleAvatarUrl = "https://placehold.co/400x400.png";
  const femaleAvatarUrl = "https://placehold.co/400x400.png";
  
  const avatarUrl = gender === 'male' ? maleAvatarUrl : femaleAvatarUrl;
  
  const supabase = await createSupabaseServerClient();

  const { error } = await (await supabase).auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
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
    return redirect(`/register?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  return redirect('/login?message=Check your email for the confirmation link.');
}



class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(code: string, message: string, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const logger = console;

const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.statusCode
    };
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const errorCode = error instanceof AppError ? error.code : 'UNKNOWN_ERROR';

  // Structured logging
  logger.error({
    message: errorMessage,
    code: errorCode,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });

  return {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred. Our wizards are working on it!'
      : errorMessage,
    code: process.env.NODE_ENV === 'production' ? undefined : errorCode
  };
};

export async function githubLogin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${new URL(headers().get('origin') as string).origin}/auth/github/callback`,
    },
  });

  if (error) {
    return redirect(`/login?message=${error.message}`);
  }

  return redirect(data.url);
}

export async function logout() {
  if (!isSupabaseConfigured) {
    return redirect('/');
  }
  const supabase = await createSupabaseServerClient();
  await (await supabase).auth.signOut();
  return redirect('/');
}


// Temporarily commented out Genkit-related functions due to type errors.
// export async function generateModule(topicDescription: string, examLevel: 'Grade 5 Scholarship' | 'O/L' | 'A/L'): Promise<{
//   success: boolean;
//   data?: CreateModuleOutput;
//   error?: string;
// }> {
//   if (!topicDescription) {
//     return { success: false, error: 'Topic description cannot be empty.' };
//   }
//   if (!examLevel) {
//     return { success: false, error: 'Exam level must be selected.' };
//   }

//   try {
//     const output = await createModuleFromDescription({ topicDescription, examLevel });
//     return { success: true, data: output };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to generate module: ${errorMessage}` };
//   }
// }

// export async function generateStory(prompt: string): Promise<{
//   success: boolean;
//   data?: CreateStoryOutput;
//   error?: string;
// }> {
//   if (!prompt) {
//     return { success: false, error: 'Prompt cannot be empty.' };
//   }

//   try {
//     const output = await createStory({ prompt });
//     return { success: true, data: output };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to generate story: ${errorMessage}` };
//   }
// }

// // // export async function submitModuleForReview(moduleData: CreateModuleOutput, topicDescription: string, examLevel: string): Promise<{
//   success: boolean;
//   error?: string;
// }> {
//   if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR;
//   const supabase = await createSupabaseServerClient();
//   try {
//     const { data, error } = await (await supabase)
//       .from('submissions')
//       .insert([
//         { 
//           topic: topicDescription, 
//           writer: 'Royal Wizard', 
//           status: 'Pending',
//           content: moduleData,
//           exam_level: examLevel,
//           image_data_uri: moduleData.imageDataUri,
//         }
//       ])
//       .select();

//     if (error) {
//       console.error('Supabase error:', error);
//       throw new Error(error.message);
//     };
//     revalidatePath('/admin');
//     return { success: true };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to submit module for review: ${errorMessage}` };
//   }
// }

export async function getSubmissions(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await (await supabase)
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
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR;
  const supabase = await createSupabaseServerClient();
  try {
    const { error } = await (await supabase)
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update submission status: ${errorMessage}` };
  }
}

// export async function saveStory(storyData: CreateStoryOutput): Promise<{
//   success: boolean;
//   error?: string;
// }> {
//   if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR;
//   const supabase = await createSupabaseServerClient();
//   try {
//     const { error } = await (await supabase)
//       .from('stories')
//       .insert([
//         { 
//           title: storyData.title, 
//           story: storyData.story,
//           image_data_uri: storyData.imageDataUri,
//         }
//       ]);

//     if (error) {
//       console.error('Supabase error:', error);
//       throw new Error(error.message);
//     };
//     revalidatePath('/dashboard/hall-of-legends');
//     return { success: true };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to save story: ${errorMessage}` };
//   }
// }

export async function getStories(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await (await supabase)
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
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await (await supabase)
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
   if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR;
   if (!content.trim()) {
    return { success: false, error: 'Post content cannot be empty.' };
  }

  const supabase = await createSupabaseServerClient();
    const { data: { user } } = await (await supabase).auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }
  
  const author_name = user.user_metadata?.name || 'Knight';
  const author_avatar = user.user_metadata?.avatar_url || 'https://placehold.co/100x100.png';

  try {
    const { data, error } = await (await supabase)
      .from('posts')
      .insert([
        { 
          user_id: user.id,
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


// export async function getApprovedModules(): Promise<{
//   success: boolean;
//   data?: any[];
//   error?: string;
// }> {
//   if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
//   const supabase = await createSupabaseServerClient();
//   try {
//     const { data, error } = await supabase
//       .from('submissions')
//       .select('id, topic, content, exam_level, image_data_uri')
//       .eq('status', 'Approved')
//       .order('created_at', { ascending: false });

//     if (error) {
//       console.error('Supabase error:', error);
//       throw new Error(error.message);
//     }
//     return { success: true, data: data || [] };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to fetch approved modules: ${errorMessage}` };
//   }
// }

// export async function getSubmissionById(id: number): Promise<{
//   success: boolean;
//   data?: {
//     topic: string;
//     content: CreateModuleOutput;
//     exam_level: string;
//     image_data_uri?: string;
//   };
//   error?: string;
// }> {
//   if (!isSupabaseConfigured) return { ...DB_NOT_CONFIGURED_ERROR, data: undefined };
//   const supabase = await createSupabaseServerClient();
//   try {
//     const { data, error } = await supabase
//       .from('submissions')
//       .select('topic, content, exam_level, image_data_uri')
//       .eq('id', id)
//       .eq('status', 'Approved')
//       .single();

//     if (error) {
//       console.error('Supabase error:', error);
//       if (error.code === 'PGRST116') { // "JSON object requested, but single row not found"
//         return { success: false, error: 'Quest not found or not yet approved.' };
//       }
//       throw new Error(error.message);
//     }
//     if (!data) {
//         return { success: false, error: 'Quest not found or not yet approved.' };
//     }
//     return { success: true, data: data as any };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to fetch submission: ${errorMessage}` };
//   }
// }

export async function getSignedUrl(fileName: string, fileType: string) {
    if (!isSupabaseConfigured) {
        return { success: false, error: 'Database not configured.' };
    }
    const supabase = await createSupabaseServerClient();
      const { data: { user } } = await (await supabase).auth.getUser();

    if (!user) {
        return { success: false, error: 'User not authenticated.' };
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filePath = `receipts/${user.id}/${Date.now()}-${cleanFileName}`;

    const { data, error } = await (await supabase).storage
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
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR;
  const supabase = await createSupabaseServerClient();
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
    revalidatePath('/admin');
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
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await (await supabase)
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
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR;
  const supabase = await createSupabaseServerClient();
  try {
    const { error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to update payment status: ${errorMessage}` };
  }
}

// Temporarily commented out Genkit-related functions due to type errors.
// export async function generateKingdomAnalytics(): Promise<{
//   success: boolean;
//   data?: KingdomReportOutput;
//   error?: string;
// }> {
//   if (!isSupabaseConfigured) {
//     return { success: false, error: 'Database not configured.' };
//   };
//   try {
//     const output = await generateKingdomReport();
//     return { success: true, data: output };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to generate report: ${errorMessage}` };
//   }
// }

// Temporarily commented out Genkit-related functions due to type errors.
// // export async function generateAudio(text: string): Promise<{
//   success: boolean;
//   data?: GenerateAudioOutput;
//   error?: string;
// }> {
//   if (!text) {
//     return { success: false, error: 'Text cannot be empty.' };
//   }

//   try {
//     const output = await generateAudioFromText(text);
//     return { success: true, data: output };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to generate audio: ${errorMessage}` };
//   }
// }

export async function getDailyChallenge(): Promise<{
  success: boolean;
  data?: DailyChallengeOutput;
  error?: string;
}> {
  try {
    const output = await generateDailyChallenge() as DailyChallengeOutput;
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate daily challenge: ${errorMessage}` };
  }
}

export async function submitDailyChallengeAnswer(challenge: DailyChallengeOutput, userAnswer: string): Promise<{
  success: boolean;
  data?: GradeChallengeOutput;
  error?: string;
}> {
  try {
    const gradingResult = await gradeDailyChallenge({ challenge, userAnswer });
    
    if (gradingResult.isCorrect) {
      if (!isSupabaseConfigured) {
         console.log("Database not configured. Skipping XP award.");
      } else {
        const supabase = await createSupabaseServerClient();
          const { data: { user } } = await (await supabase).auth.getUser();

        if (user) {
          // Parse XP from the reward string, e.g., "150 XP"
          const xpMatch = challenge.reward.match(/(\d+)\s*XP/i);
          const xpGained = xpMatch ? parseInt(xpMatch[1], 10) : 50; // Default XP if parsing fails

          const { error: rpcError } = await supabase.rpc('award_xp', { user_id_in: user.id, xp_to_add: xpGained });
          if (rpcError) {
             console.error("Error awarding XP for daily challenge:", rpcError.message);
             // Don't fail the whole operation, just log the error
          } else {
            revalidatePath('/dashboard');
            revalidatePath('/dashboard/profile');
          }
        }
      }
    }

    return { success: true, data: gradingResult };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to grade answer: ${errorMessage}` };
  }
}

export async function getUserStats(): Promise<{
  success: boolean;
  data?: { xp: number; level: number; progress: number; questsCompleted: number; rank: number | 'N/A'; activeStreak: number; };
  error?: string;
}> {
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
  const supabase = await createSupabaseServerClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated.' };
    }

    const { data, error } = await supabase
      .from('user_stats')
      .select('xp, level, progress, quests_completed, rank, active_streak')
      .eq('user_id', user.id)
      .single();

    if (error) throw new Error(error.message);

    // Assuming quests_completed, rank, and active_streak are columns in user_stats
    // and need to be mapped to the UserStats interface.
    // If 'rank' is not directly available, you might need a more complex query or RPC.
    return { success: true, data: {
      xp: data.xp,
      level: data.level,
      progress: data.progress,
      questsCompleted: data.quests_completed || 0, // Default to 0 if null
      rank: data.rank || 'N/A', // Default to 'N/A' if null
      activeStreak: data.active_streak || 0 // Default to 0 if null
    } };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: `Failed to fetch user stats: ${errorMessage}` };
  }
}

export async function getLeaderboard(limit = 10): Promise<{
  success: boolean;
  data?: Array<{ name: string; xp: number; level: number }>;
  error?: string;
}> {
  if (!isSupabaseConfigured) return DB_NOT_CONFIGURED_ERROR_WITH_DATA;
  const supabase = await createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('name, xp, level')
      .order('xp', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return { success: true, data: data || [] };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return { success: false, error: `Leaderboard fetch failed: ${errorMessage}` };
  }
}

// // export async function getTeamWarData(): Promise<{
//   success: boolean;
//   data?: TeamWarReportOutput;
//   error?: string;
// }> {
//   try {
//     const output = await generateTeamWarReport();
//     return { success: true, data: output };
//   } catch (e) {
//     console.error(e);
//     const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
//     return { success: false, error: `Failed to generate team war data: ${errorMessage}` };
//   }
// }

export async function updateUserPublicProfile(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  // Placeholder implementation
  console.log("updateUserPublicProfile called with:", formData);
  return { success: true, error: undefined };
}

export async function recordQuestCompletion(submissionId: number, correctAnswers: number, totalQuestions: number): Promise<{
  success: boolean;
  message?: string;
  xpGained?: number;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database not configured.' };
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    // Check if the user has already completed this quest
    const { data: existingCompletion, error: fetchError } = await supabase
      .from('user_quest_completions')
      .select('*')
      .eq('user_id', user.id)
      .eq('submission_id', submissionId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw new Error(fetchError.message);
    }

    if (existingCompletion) {
      return { success: true, message: 'Quest already completed.' };
    }

    // Calculate XP gained (e.g., 10 XP per correct answer)
    const xpGained = correctAnswers * 10;

    // Record quest completion
    const { error: insertError } = await supabase
      .from('user_quest_completions')
      .insert({
        user_id: user.id,
        submission_id: submissionId,
        score: correctAnswers,
        total_questions: totalQuestions,
        xp_gained: xpGained,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Update user stats (XP and quests completed)
    const { error: rpcError } = await supabase.rpc('award_xp_and_quest', {
      user_id_in: user.id,
      xp_to_add: xpGained,
    });

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');

    return { success: true, xpGained };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to record quest completion: ${errorMessage}` };
  }
}
