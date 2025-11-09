import { createClient } from "@supabase/supabase-js";

// Use safe fallbacks during build so missing envs don't crash import time.
// Railway/CI builds may evaluate modules; defer hard failures to runtime usage.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.invalid";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-key-placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});


