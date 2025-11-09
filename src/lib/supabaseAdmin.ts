import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key.
// Never expose this key to the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Make initialization safe in local dev if env is missing. Routes should check for null and
// return a helpful error instead of crashing with a 500.
export const supabaseAdmin = (supabaseUrl && serviceRoleKey)
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;


