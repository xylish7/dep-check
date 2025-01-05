import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../supabase/types";
import { getSession, getUser, signInWithGoogle, signOut } from "./auth";
import { getProfile } from "./profiles";
import { getGithubTokens, updateGithubTokens } from "./github";

export type Client = SupabaseClient<Database>;

export const supabaseApi = {
  auth: { getUser, getSession, signInWithGoogle, signOut },
  github: {
    getTokens: getGithubTokens,
    updateTokens: updateGithubTokens,
  },
  profiles: {
    getByUuid: getProfile,
  },
};

type DbProfile = Database["public"]["Tables"]["profiles"];
export type ProfileRow = DbProfile["Row"];
export type ProfileInsert = DbProfile["Insert"];
export type ProfileUpdate = DbProfile["Update"];

type DbGithubTokens = Database["public"]["Tables"]["github_tokens"];
export type GithubTokensRow = DbGithubTokens["Row"];
export type GithubTokensInsert = DbGithubTokens["Insert"];
export type GithubTokensUpdate = DbGithubTokens["Update"];
