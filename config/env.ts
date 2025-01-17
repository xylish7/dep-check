import { siteConfig } from "./site";

export const env = process.env.NODE_ENV as "development" | "production";
export const host =
  env === "development" ? "http://localhost:3000" : siteConfig.host;

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Server-side only
export const supabaseAdminKey = process.env.SUPABASE_ADMIN_KEY ?? "";
