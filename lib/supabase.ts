import { createClient } from "@supabase/supabase-js"

// For client-side usage, we need to check if the environment variables are defined
// and use empty strings as fallbacks to prevent errors during build/render
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase configuration error:", {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  })
  throw new Error("Supabase URL or Anon Key is missing. Please check your environment variables.")
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
  avatar_url?: string
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
