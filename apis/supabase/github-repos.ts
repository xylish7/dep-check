import { PostgrestError } from "@supabase/supabase-js";
import { Client, GithubReposInsert, GithubReposRow } from ".";

export async function getAllGithubRepos(
  supabase: Client,
  uuid: string
): Promise<{
  data: GithubReposRow[];
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("github_repos")
    .select("*")
    .eq("uuid", uuid);

  return { data: data ?? [], error };
}

export async function getGithubRepo(
  supabase: Client,
  id: number
): Promise<{
  data: GithubReposRow | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("github_repos")
    .select()
    .eq("id", id)
    .single();

  return { data, error };
}

export async function addGithubRepos(
  supabase: Client,
  args: GithubReposInsert
): Promise<{
  data: GithubReposRow | null;
  error: PostgrestError | null;
}> {
  const { error, data } = await supabase
    .from("github_repos")
    .insert(args)
    .select()
    .single();

  return { data, error };
}

export async function updateGithubRepo(
  supabase: Client,
  id: number,
  args: Partial<GithubReposInsert>
): Promise<{
  data: GithubReposRow | null;
  error: PostgrestError | null;
}> {
  const { error, data } = await supabase
    .from("github_repos")
    .update(args)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}
