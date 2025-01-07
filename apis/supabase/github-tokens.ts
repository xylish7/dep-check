import { PostgrestError } from "@supabase/supabase-js";
import { Client, GithubTokensInsert, GithubTokensRow } from ".";

export async function updateGithubTokens(
  supabase: Client,
  args: GithubTokensInsert
): Promise<{
  error: PostgrestError | null;
}> {
  const { error } = await supabase
    .from("github_tokens")
    .upsert(args)
    .eq("id", args.id);

  return { error };
}

export async function getGithubTokens(
  supabase: Client,
  id: string
): Promise<{
  data: GithubTokensRow | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("github_tokens")
    .select("*")
    .eq("id", id);

  return { data: data ? data[0] : null, error };
}
