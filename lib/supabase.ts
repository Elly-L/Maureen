import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ziymgitmxnuboieshnsa.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeW1naXRteG51Ym9pZXNobnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Mjg3ODIsImV4cCI6MjA2MzMwNDc4Mn0.V29cBQ4vvjjAIk5GbgR6ONOeqp37tsuSWW-SwFRm1RM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
