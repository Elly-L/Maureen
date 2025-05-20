-- Function to delete a user and all associated data
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  -- Delete user data from various tables
  -- First delete from tables with foreign key constraints
  DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE buyer_id = user_id OR seller_id = user_id);
  DELETE FROM orders WHERE buyer_id = user_id OR seller_id = user_id;
  DELETE FROM cart_items WHERE user_id = user_id;
  DELETE FROM products WHERE seller_id = user_id;
  
  -- Delete from seller_profiles if it exists
  DELETE FROM seller_profiles WHERE user_id = user_id;
  
  -- Delete from profiles
  DELETE FROM profiles WHERE id = user_id;
  
  -- Finally, delete the auth user
  -- This requires admin privileges, so we use a trigger instead
  -- The following is commented out as it requires admin privileges
  -- DELETE FROM auth.users WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to delete auth.users when a profile is deleted
CREATE OR REPLACE FUNCTION handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete from auth.users
  -- This requires the function to be SECURITY DEFINER
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_deleted
AFTER DELETE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_deleted_user();
