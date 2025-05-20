-- Function to ensure user roles are properly set
CREATE OR REPLACE FUNCTION ensure_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the role from user metadata
  DECLARE
    user_role TEXT;
  BEGIN
    -- Extract role from metadata
    user_role := (NEW.raw_user_meta_data->>'role');
    
    -- If role is not set in metadata, default to 'buyer'
    IF user_role IS NULL THEN
      user_role := 'buyer';
    END IF;
    
    -- Update the profile with the correct role
    UPDATE profiles
    SET role = user_role
    WHERE id = NEW.id;
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to ensure roles are set correctly
DROP TRIGGER IF EXISTS ensure_user_role_trigger ON auth.users;
CREATE TRIGGER ensure_user_role_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION ensure_user_role();

-- Function to fix existing users with incorrect roles
CREATE OR REPLACE FUNCTION fix_existing_user_roles()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id, raw_user_meta_data->>'role' as meta_role
    FROM auth.users
    WHERE raw_user_meta_data->>'role' IS NOT NULL
  LOOP
    UPDATE profiles
    SET role = user_record.meta_role
    WHERE id = user_record.id AND (role IS NULL OR role <> user_record.meta_role);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run this function to fix existing users
-- SELECT fix_existing_user_roles();
