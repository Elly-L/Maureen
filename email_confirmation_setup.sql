-- Enable email confirmations in Supabase Auth
-- Note: This needs to be run by a Supabase admin or through the dashboard

-- First, check if email confirmations are enabled
SELECT * FROM auth.config;

-- If you need to enable email confirmations, you can use the following SQL
-- (requires admin privileges)
UPDATE auth.config
SET enable_signup_email_confirmations = true;

-- Create a trigger to handle user creation even if email is not confirmed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles regardless of email confirmation status
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  )
  ON CONFLICT (id) DO NOTHING; -- Avoid duplicate inserts
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
