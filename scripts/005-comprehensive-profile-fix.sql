-- Comprehensive fix for profile creation issues
-- This script handles both new users and existing users without profiles

-- 1. First, ensure the profiles table exists and has correct structure
-- (This should already exist from your 001-create-tables.sql)

-- 2. Create or update the function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',      -- From signup form
      NEW.raw_user_meta_data->>'name',           -- From Google OAuth
      NEW.raw_user_meta_data->>'display_name',   -- From some providers
      NEW.raw_user_meta_data->>'user_name',      -- From GitHub
      split_part(NEW.email, '@', 1)              -- Fallback: email prefix
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',     -- Custom field
      NEW.raw_user_meta_data->>'picture',        -- From Google OAuth
      NEW.raw_user_meta_data->>'avatar',         -- From GitHub
      NEW.raw_user_meta_data->>'avatar_url'      -- Alternative
    ),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, update it instead
    UPDATE public.profiles 
    SET 
      email = NEW.email,
      full_name = COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'display_name',
        NEW.raw_user_meta_data->>'user_name',
        profiles.full_name,  -- Keep existing if no new data
        split_part(NEW.email, '@', 1)
      ),
      avatar_url = COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        NEW.raw_user_meta_data->>'avatar',
        profiles.avatar_url  -- Keep existing if no new data
      )
    WHERE id = NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE LOG 'Error in handle_new_user for user %: % %', NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- 3. Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Create profiles for any existing users who don't have them
INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at)
SELECT DISTINCT
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'display_name',
    au.raw_user_meta_data->>'user_name',
    split_part(au.email, '@', 1)
  ) as full_name,
  COALESCE(
    au.raw_user_meta_data->>'avatar_url',
    au.raw_user_meta_data->>'picture',
    au.raw_user_meta_data->>'avatar'
  ) as avatar_url,
  au.created_at
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles)
  AND au.email IS NOT NULL
  AND au.email_confirmed_at IS NOT NULL;

-- 5. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

-- 6. Verify the setup
DO $$
BEGIN
  RAISE NOTICE 'Profile creation setup complete!';
  RAISE NOTICE 'Total auth users: %', (SELECT COUNT(*) FROM auth.users WHERE email IS NOT NULL);
  RAISE NOTICE 'Total profiles: %', (SELECT COUNT(*) FROM public.profiles);
  RAISE NOTICE 'Users without profiles: %', (
    SELECT COUNT(*) 
    FROM auth.users au 
    WHERE au.id NOT IN (SELECT id FROM public.profiles) 
      AND au.email IS NOT NULL
  );
END
$$;
