import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing. URL:", supabaseUrl, "Key:", supabaseAnonKey)
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file and restart the development server.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log the Supabase URL (but not the key for security reasons)
console.log("Supabase URL:", supabaseUrl)

