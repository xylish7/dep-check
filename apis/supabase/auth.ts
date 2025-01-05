import { AuthError, OAuthResponse, Session, User } from "@supabase/supabase-js";

import { host } from "@/config/env";
import { Client } from ".";

export async function signInWithGoogle(
  supabase: Client,
  redirectTo?: string
): Promise<OAuthResponse> {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        `${host}/api/auth/callback` + (redirectTo ? `?next=${redirectTo}` : ""),
    },
  });
}

export async function signOut(supabase: Client): Promise<{
  error: AuthError | null;
}> {
  return await supabase.auth.signOut();
}

export async function getUser(supabase: Client): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  const { data, error } = await supabase.auth.getUser();

  return { user: data ? data.user : null, error };
}

export async function getSession(supabase: Client): Promise<{
  session: Session | null;
  error: AuthError | null;
}> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { session, error };
}
