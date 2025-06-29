-- Enable Row Level Security for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Policies for public.profiles
-- Allow authenticated users to read their own profile
CREATE POLICY "Allow authenticated users to read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
-- Allow authenticated users to update their own profile
CREATE POLICY "Allow authenticated users to update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
-- Allow authenticated users to insert their own profile (on signup)
CREATE POLICY "Allow authenticated users to insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for public.stories
-- Allow all users to read stories
CREATE POLICY "Allow all users to read stories" ON public.stories
  FOR SELECT USING (true);
-- Allow authenticated users to insert stories (if applicable, e.g., for admins/content creators)
-- Adjust roles as needed
CREATE POLICY "Allow authenticated users to insert stories" ON public.stories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies for public.posts
-- Allow all users to read posts
CREATE POLICY "Allow all users to read posts" ON public.posts
  FOR SELECT USING (true);
-- Allow authenticated users to insert posts
CREATE POLICY "Allow authenticated users to insert posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- Allow authenticated users to update their own posts
CREATE POLICY "Allow authenticated users to update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = (SELECT id FROM public.profiles WHERE author_name = auth.jwt() ->> 'name')); -- This might need adjustment based on how author_name is linked to user_id
-- Allow authenticated users to delete their own posts
CREATE POLICY "Allow authenticated users to delete own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.payments
-- Allow authenticated users to insert payments (e.g., for submitting payment proof)
CREATE POLICY "Allow authenticated users to insert payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- Allow admins to read all payments (assuming 'admin' role exists in profiles table)
CREATE POLICY "Allow admins to read all payments" ON public.payments
  FOR SELECT USING (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
-- Allow admins to update payment status
CREATE POLICY "Allow admins to update payment status" ON public.payments
  FOR UPDATE USING (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Policies for public.quest_completions
-- Allow authenticated users to insert their own quest completions
CREATE POLICY "Allow authenticated users to insert own quest completions" ON public.quest_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Allow authenticated users to read their own quest completions
CREATE POLICY "Allow authenticated users to read own quest completions" ON public.quest_completions
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for public.submissions
-- Allow authenticated users to read approved submissions
CREATE POLICY "Allow authenticated users to read approved submissions" ON public.submissions
  FOR SELECT USING (status = 'Approved');
-- Allow admins to insert, update, and delete submissions (assuming 'admin' role exists)
CREATE POLICY "Allow admins to manage submissions" ON public.submissions
  FOR ALL USING (auth.role() = 'authenticated' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
