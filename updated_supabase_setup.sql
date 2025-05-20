-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller')),
  location TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp trigger to all tables
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_cart_items_timestamp
BEFORE UPDATE ON public.cart_items
FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to fix existing user roles
CREATE OR REPLACE FUNCTION fix_existing_user_roles()
RETURNS VOID AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT * FROM auth.users
  LOOP
    UPDATE public.profiles
    SET role = COALESCE(user_record.raw_user_meta_data->>'role', 'buyer')
    WHERE id = user_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up RLS (Row Level Security)
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Sellers can insert their own products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products"
ON public.products FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products"
ON public.products FOR DELETE
TO authenticated
USING (auth.uid() = seller_id);

-- Orders policies
CREATE POLICY "Buyers can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view orders containing their products"
ON public.orders FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.order_items oi
  JOIN public.products p ON oi.product_id = p.id
  WHERE oi.order_id = orders.id AND p.seller_id = auth.uid()
));

CREATE POLICY "Buyers can insert their own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = buyer_id);

-- Order items policies
CREATE POLICY "Buyers can view their own order items"
ON public.order_items FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_id AND o.buyer_id = auth.uid()
));

CREATE POLICY "Sellers can view order items for their products"
ON public.order_items FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.products p
  WHERE p.id = product_id AND p.seller_id = auth.uid()
));

CREATE POLICY "Buyers can insert their own order items"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_id AND o.buyer_id = auth.uid()
));

-- Cart items policies
CREATE POLICY "Users can view their own cart items"
ON public.cart_items FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Users can update their own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Insert default categories if needed
INSERT INTO public.categories (name)
VALUES 
  ('Vegetables'),
  ('Fruits'),
  ('Grains'),
  ('Dairy'),
  ('Meat'),
  ('Other')
ON CONFLICT (name) DO NOTHING;
