"use server";

import { redirect } from "next/navigation";

import { supabaseApi } from "@/supabase/api";
import { serverClient } from "@/supabase/clients/server";

export async function signIn(redirectTo?: string) {
  const supabaseClient = await serverClient();

  const { data, error } = await supabaseApi.auth.signInWithGoogle(
    supabaseClient,
    redirectTo
  );

  if (error) {
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url);
  }
}
