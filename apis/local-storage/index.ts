import {
  addGithubRepo,
  deleteGithubRepo,
  getAllGithubRepos,
  getGithubRepo,
  updateGithubRepo,
} from "./github-repos";

export const localStorageApi = {
  repos: {
    add: addGithubRepo,
    update: updateGithubRepo,
    delete: deleteGithubRepo,
    get: getGithubRepo,
    getAll: getAllGithubRepos,
  },
};

export type Package = {
  current: string;
  depType: Dependency;
  last: string;
  name: string;
  version?: Version;
};

export type Dependency = "dep" | "devDep";

export type Version = "major" | "minor" | "patch";

export interface GithubRepoRow {
  id: number;
  last_check: string | null;
  name: string;
  package_json: string;
  packages: Package[] | null;
}

export type GithubRepoInsert = Omit<GithubRepoRow, "id">;
