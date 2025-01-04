import { PostgrestError } from "@supabase/supabase-js";
import { Client, GithubTokensUpdate } from ".";

export async function updateGithubTokens(
  supabase: Client,
  uuid: string,
  args: Required<GithubTokensUpdate>
): Promise<{
  error: PostgrestError | null;
}> {
  const { error } = await supabase
    .from("github_tokens")
    .upsert(args)
    .eq("id", uuid);

  return { error };
}
