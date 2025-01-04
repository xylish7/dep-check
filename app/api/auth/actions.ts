"use server";

import { redirect } from "next/navigation";

import { supabaseApi } from "@/supabase/api";
import { serverClient } from "@/supabase/clients/server";

export async function signOut() {
  const supabaseClient = await serverClient();

  const { error } = await supabaseApi.auth.signOut(supabaseClient);

  if (error) {
    redirect("/server-error");
  }

  redirect("/");
}
