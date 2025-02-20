import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../supabase/types";
import { getSession, getUser, signInWithGoogle, signOut } from "./auth";
import { getProfile } from "./profiles";
import { getGithubTokens, updateGithubTokens } from "./github-tokens";
import {
  addGithubRepos,
  deleteGithubRepo,
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
      delete: deleteGithubRepo,
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

export type Version = "major" | "minor" | "patch";
export type Dependency = "dep" | "devDep";

export type Package = {
  current: string;
  depType: Dependency;
  last: string;
  name: string;
  version?: Version;
};

type DbGithubRepos = Database["public"]["Tables"]["github_repos"];
export interface GithubReposRow extends Omit<DbGithubRepos["Row"], "packages"> {
  packages: Package[] | null;
}
export interface GithubReposInsert
  extends Omit<DbGithubRepos["Insert"], "packages"> {
  packages?: Package[];
}
export interface GithubReposUpdate
  extends Omit<DbGithubRepos["Update"], "packages"> {
  packages?: Package[];
}
