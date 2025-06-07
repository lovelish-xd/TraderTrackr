-- Create users table (handled by Supabase Auth)
-- We'll create a profiles table to store additional user information

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  instrument_type TEXT NOT NULL,
  trade_type TEXT NOT NULL,
  ticker_symbol TEXT NOT NULL,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  exit_date TIMESTAMP WITH TIME ZONE,
  entry_price DECIMAL(18, 6) NOT NULL,
  exit_price DECIMAL(18, 6),
  position_size DECIMAL(18, 6) NOT NULL,
  direction TEXT NOT NULL,
  stop_loss DECIMAL(18, 6),
  target DECIMAL(18, 6),
  strategy TEXT,
  fees DECIMAL(18, 6),
  rationale TEXT,
  market_conditions TEXT,
  pre_trade_emotion TEXT,
  post_trade_reflection TEXT,
  profit_loss DECIMAL(18, 6),
  risk_reward_ratio DECIMAL(18, 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trades policies
CREATE POLICY "Users can view their own trades"
  ON trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades"
  ON trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades"
  ON trades FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades"
  ON trades FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
