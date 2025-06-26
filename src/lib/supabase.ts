
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: These values are read from the .env file.
// Make sure you have a .env file at the root of your project with these variables defined.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required.')
}

// Initialize the Supabase client.
// This client can be used to interact with your Supabase database, authentication, and storage.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
