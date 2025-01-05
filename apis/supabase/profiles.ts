import { PostgrestError } from "@supabase/supabase-js";
import { Client, ProfileRow } from ".";

export async function getProfile(
  supabase: Client,
  uuid: string
): Promise<{
  profile: ProfileRow | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uuid)
    .single();

  return { profile: data, error };
}
