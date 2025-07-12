import { createClient } from "@supabase/supabase-js"

// For client-side usage, we need to check if the environment variables are defined
// and use fallback values to prevent errors during build/render
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ""

// Check if the URL is properly formatted
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.error("Supabase configuration error:", {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    isValidUrl: isValidUrl(supabaseUrl)
  })
  
  // Throw a more descriptive error
  if (!supabaseUrl || supabaseUrl.includes('your-project-id') || supabaseUrl.includes('your_supabase_project_url_here')) {
    throw new Error("Please set your NEXT_PUBLIC_SUPABASE_URL in .env.local file with your actual Supabase project URL")
  }
  if (!supabaseAnonKey || supabaseAnonKey.includes('your_anon_key') || supabaseAnonKey.includes('your_supabase_anon_key_here')) {
    throw new Error("Please set your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file with your actual Supabase anon key")
  }
  throw new Error("Supabase URL or Anon Key is missing or invalid. Please check your environment variables.")
}

// Create a Supabase client with the anonymous key for client-side requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Create a Supabase client with the service role key for server-side requests
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Types for our database tables
export type User = {
  id: string
  email: string
  created_at: string
  updated_at: string
  name?: string
}

export type Trade = {
  id: string
  user_id: string
  instrument_type: string
  trade_type: string
  ticker_symbol: string
  entry_date: string
  entry_time: string
  exit_date?: string
  exit_time?: string
  entry_price: number
  exit_price?: number
  position_size: number
  stop_loss?: number
  target?: number
  strategy?: string
  trade_performance_type?: string
  trade_performance_value?: number
  currency?: string
  fees?: number
  rationale?: string
  market_conditions?: string
  pre_trade_emotion?: string
  post_trade_reflection?: string
  trade_screenshot?: string
  profit_loss?: number
  created_at: string
  updated_at: string
}
