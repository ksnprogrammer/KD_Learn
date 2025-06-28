-- Function to award XP to a user (corrected with search_path)
CREATE OR REPLACE FUNCTION public.award_xp(user_id_in uuid, xp_to_add integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, xp)
  VALUES (user_id_in, xp_to_add)
  ON CONFLICT (id) DO UPDATE
  SET xp = public.profiles.xp + xp_to_add;
END;
$$;

-- Function to get leaderboard data (corrected with search_path)
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  id uuid,
  name text,
  xp integer,
  avatar_url text,
  avatar_hint text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.xp,
    p.avatar_url,
    p.avatar_hint
  FROM
    public.profiles p
  ORDER BY
    p.xp DESC;
END;
$$;