import { createClient } from "@supabase/supabase-js";

import { supabaseAdminKey, supabaseUrl } from "@/config/env";
import { Database } from "../types";

export function adminClient() {
  return createClient<Database>(supabaseUrl, supabaseAdminKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
