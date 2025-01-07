import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../supabase/types";
import { getSession, getUser, signInWithGoogle, signOut } from "./auth";
import { getProfile } from "./profiles";
import { getGithubTokens, updateGithubTokens } from "./github-tokens";
import {
  addGithubRepos,
  getAllGithubRepos,
  getGithubRepo,
  updateGithubRepo,
} from "./github-repos";

export type Client = SupabaseClient<Database>;

export const supabaseApi = {
  auth: { getUser, getSession, signInWithGoogle, signOut },
  github: {
    repos: {
      add: addGithubRepos,
      get: getGithubRepo,
      getAll: getAllGithubRepos,
      update: updateGithubRepo,
    },
    tokens: {
      get: getGithubTokens,
      update: updateGithubTokens,
    },
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

export type DependencyType = "major" | "minor" | "patch" | "major-zero";

export type Dependency = {
  current: string;
  last: string;
  type?: DependencyType;
};

export type Dependencies = Record<string, Dependency>;

export type Updates = {
  dependencies: Dependencies;
  devDependencies: Dependencies;
};

type DbGithubRepos = Database["public"]["Tables"]["github_repos"];
export interface GithubReposRow extends Omit<DbGithubRepos["Row"], "updates"> {
  updates: Updates | null;
}
export interface GithubReposInsert
  extends Omit<DbGithubRepos["Insert"], "updates"> {
  updates?: Updates;
}
export interface GithubReposUpdate
  extends Omit<DbGithubRepos["Update"], "updates"> {
  updates?: Updates;
}
