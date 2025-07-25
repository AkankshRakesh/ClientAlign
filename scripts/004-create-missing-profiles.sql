-- Script to create profiles for existing users who don't have them
-- This is useful when you add the trigger after users have already signed up

-- Create profiles for existing users who don't have them
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'display_name',
    split_part(au.email, '@', 1)
  ) as full_name,
  COALESCE(
    au.raw_user_meta_data->>'avatar_url',
    au.raw_user_meta_data->>'picture',
    au.raw_user_meta_data->>'avatar'
  ) as avatar_url
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL;

-- Check how many profiles were created
SELECT 
  (SELECT COUNT(*) FROM auth.users WHERE email IS NOT NULL) as total_users,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles,
  (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON au.id = p.id WHERE p.id IS NULL AND au.email IS NOT NULL) as missing_profiles;
