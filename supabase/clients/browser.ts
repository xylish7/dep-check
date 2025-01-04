import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/config/env";
import { Database } from "../types";

export function browserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
