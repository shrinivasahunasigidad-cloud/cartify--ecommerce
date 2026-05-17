
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'seller')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Everyone can view approved products" 
  ON products FOR SELECT 
  USING (approval_status = 'approved');

CREATE POLICY "Sellers can view their own products" 
  ON products FOR SELECT 
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can insert products" 
  ON products FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products" 
  ON products FOR UPDATE 
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products" 
  ON products FOR DELETE 
  USING (auth.uid() = seller_id);

CREATE POLICY "Admins can view all products" 
  ON products FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update products" 
  ON products FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  store_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT,
  address TEXT,
  bank_account_details TEXT,
  gst_number TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sellers
CREATE POLICY "Sellers can view their own data" 
  ON sellers FOR SELECT 
  USING (auth.uid() = profile_id);

CREATE POLICY "Sellers can insert their data" 
  ON sellers FOR INSERT 
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Sellers can update their own data" 
  ON sellers FOR UPDATE 
  USING (auth.uid() = profile_id);

CREATE POLICY "Admins can view all sellers" 
  ON sellers FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart
CREATE POLICY "Users can view their own cart" 
  ON cart FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their cart" 
  ON cart FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart" 
  ON cart FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their cart" 
  ON cart FOR DELETE 
  USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
  ON orders FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders" 
  ON orders FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample products
INSERT INTO products (title, description, price, image_url, category, stock, approval_status, seller_id) VALUES
  -- Electronics
  ('Sony WH-1000XM5 Wireless Headphones', 'Industry-leading noise cancellation with exceptional sound quality', 29990.00, 'https://images-eu.ssl-images-amazon.com/images/I/618j2s8gT6L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Electronics', 25, 'approved', NULL),
  ('Apple AirPods Pro 2', 'Active Noise Cancellation, Spatial Audio with Dynamic Head Tracking', 24999.00, 'https://images-eu.ssl-images-amazon.com/images/I/51rGA57sF9L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Electronics', 40, 'approved', NULL),
  ('Samsung Galaxy S24 Ultra', '5G, 12GB RAM, 256GB Storage, 200MP Camera', 124999.00, 'https://images-eu.ssl-images-amazon.com/images/I/71n1E2j6F6L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Electronics', 15, 'approved', NULL),
  ('Dell XPS 15 Laptop', 'Intel i7, 16GB RAM, 512GB SSD, 15.6" 4K Display', 119999.00, 'https://images-eu.ssl-images-amazon.com/images/I/61f31R9u3vL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Electronics', 10, 'approved', NULL),
  ('Kindle Paperwhite (16 GB)', 'Waterproof, 6.8" display, adjustable warm light', 14999.00, 'https://images-eu.ssl-images-amazon.com/images/I/71MaPXjPCeL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Electronics', 50, 'approved', NULL),
  
  -- Fashion
  ('Nike Air Max 270', 'Men''s Running Shoes with Air Cushioning', 13995.00, 'https://images-eu.ssl-images-amazon.com/images/I/710aJj8d1hL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Fashion', 60, 'approved', NULL),
  ('Levi''s 511 Slim Fit Jeans', 'Premium quality denim with perfect fit', 4999.00, 'https://images-eu.ssl-images-amazon.com/images/I/714pWZq67vL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Fashion', 80, 'approved', NULL),
  ('Adidas Originals Superstar', 'Iconic sneakers with shell-toe design', 9999.00, 'https://images-eu.ssl-images-amazon.com/images/I/61v3dR8T9IL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Fashion', 45, 'approved', NULL),
  ('Zara Men''s Cotton T-Shirt', 'Soft and comfortable cotton t-shirt', 1999.00, 'https://images-eu.ssl-images-amazon.com/images/I/71A42qg3VBL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Fashion', 120, 'approved', NULL),
  ('Puma Women''s Sports Jacket', 'Lightweight and breathable sports jacket', 3499.00, 'https://images-eu.ssl-images-amazon.com/images/I/71y1UvJQwYL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Fashion', 35, 'approved', NULL),
  
  -- Home & Kitchen
  ('Prestige Electric Pressure Cooker', '5L capacity, 12-in-1 multi-functional', 6499.00, 'https://images-eu.ssl-images-amazon.com/images/I/61D4Z3yKPAL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Home & Kitchen', 30, 'approved', NULL),
  ('Philips Air Fryer HD9252', 'Rapid Air Technology, 4.1L capacity', 9995.00, 'https://images-eu.ssl-images-amazon.com/images/I/71z1kXwL4QL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Home & Kitchen', 20, 'approved', NULL),
  ('Bajaj Mixer Grinder', '750W, 3 stainless steel jars', 3299.00, 'https://images-eu.ssl-images-amazon.com/images/I/61a1234567L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Home & Kitchen', 55, 'approved', NULL),
  ('Sleepwell Memory Foam Pillow', 'Orthopedic pillow for neck support', 1899.00, 'https://images-eu.ssl-images-amazon.com/images/I/81b1k4sJ7tL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Home & Kitchen', 75, 'approved', NULL),
  ('AmazonBasics Non-Stick Cookware Set', '5-piece non-stick cookware set', 4599.00, 'https://images-eu.ssl-images-amazon.com/images/I/91c1234567L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Home & Kitchen', 40, 'approved', NULL),
  
  -- Sports
  ('Cosco Cricket Bat', 'Kashmir Willow, full size, light weight', 2499.00, 'https://images-eu.ssl-images-amazon.com/images/I/71a9140J4NL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Sports', 25, 'approved', NULL),
  ('Yonex Badminton Racquet', 'Carbon graphite, light weight', 3999.00, 'https://images-eu.ssl-images-amazon.com/images/I/61e1234567L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Sports', 35, 'approved', NULL),
  ('Nike Football', 'Premier League official match ball', 5999.00, 'https://images-eu.ssl-images-amazon.com/images/I/81f1UvJQwYL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Sports', 40, 'approved', NULL),
  ('Fitbit Charge 6 Fitness Tracker', 'Heart rate, GPS, sleep tracking', 14999.00, 'https://images-eu.ssl-images-amazon.com/images/I/71g1234567L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Sports', 30, 'approved', NULL),
  ('Nivia Basketball', 'Size 7, composite leather', 1899.00, 'https://images-eu.ssl-images-amazon.com/images/I/61h1k4sJ7tL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Sports', 50, 'approved', NULL),
  
  -- Beauty
  ('L''Oreal Paris Vitamin C Serum', 'Brightening Face Serum for Glowing Skin', 1199.00, 'https://images-eu.ssl-images-amazon.com/images/I/61fPwYQXQAL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Beauty', 100, 'approved', NULL),
  ('Dove Shampoo', 'Intense Repair for damaged hair, 650ml', 449.00, 'https://images-eu.ssl-images-amazon.com/images/I/81j1UvJQwYL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Beauty', 150, 'approved', NULL),
  ('Nivea Soft Cream', 'Moisturizing cream, 300ml', 399.00, 'https://images-eu.ssl-images-amazon.com/images/I/61k1k4sJ7tL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Beauty', 200, 'approved', NULL),
  ('Maybelline New York Foundation', 'Fit Me, Matte + Poreless', 549.00, 'https://images-eu.ssl-images-amazon.com/images/I/71l1UvJQwYL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Beauty', 80, 'approved', NULL),
  ('The Man Company Beard Oil', 'Argan & Jojoba Oil, 50ml', 399.00, 'https://images-eu.ssl-images-amazon.com/images/I/81m1k4sJ7tL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Beauty', 90, 'approved', NULL),
  
  -- Toys
  ('Lego Star Wars Millennium Falcon', '1353 pieces, building toy set', 8999.00, 'https://images-eu.ssl-images-amazon.com/images/I/81nOEP2kP5L._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Toys', 15, 'approved', NULL),
  ('Barbie Dreamhouse Adventures', 'Doll with accessories', 1999.00, 'https://images-eu.ssl-images-amazon.com/images/I/71o1UvJQwYL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Toys', 45, 'approved', NULL),
  ('Hot Wheels 20 Car Pack', 'Die-cast vehicles, assorted styles', 2499.00, 'https://images-eu.ssl-images-amazon.com/images/I/81p1k4sJ7tL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Toys', 60, 'approved', NULL),
  ('Fisher-Price Rock-a-Stack', 'Classic stacking toy for infants', 599.00, 'https://images-eu.ssl-images-amazon.com/images/I/61q1UvJQwYL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Toys', 120, 'approved', NULL),
  ('Monopoly Classic Board Game', 'Family game, property trading', 999.00, 'https://images-eu.ssl-images-amazon.com/images/I/71r1k4sJ7tL._AC_SX300_SY300_QL70_FMwebp_.jpg', 'Toys', 80, 'approved', NULL);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
