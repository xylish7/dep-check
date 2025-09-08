// LocalStorage-based alternative for github repos API
// All repos are stored under the 'data' key in localStorage as an array of objects

import { GithubRepoInsert, GithubRepoRow } from ".";

export const REPOS_STORAGE_KEY = "repos";

function getReposFromStorage(): GithubRepoRow[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(REPOS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GithubRepoRow[];
  } catch {
    return [];
  }
}

function setReposToStorage(repos: GithubRepoRow[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPOS_STORAGE_KEY, JSON.stringify(repos));
}

export function getAllGithubRepos(): {
  data: GithubRepoRow[];
  error: null;
} {
  const repos = getReposFromStorage();
  return { data: repos, error: null };
}

export function getGithubRepo(id: number): {
  data: GithubRepoRow | null;
  error: null;
} {
  const repo = getReposFromStorage().find((r) => r.id === id) || null;
  return { data: repo, error: null };
}

export function addGithubRepo(args: GithubRepoInsert): {
  data: GithubRepoRow | null;
  error: null;
} {
  const repos = getReposFromStorage();
  const newId = repos.length > 0 ? Math.max(...repos.map((r) => r.id)) + 1 : 1;
  const newRepo: GithubRepoRow = { id: newId, ...args };
  repos.push(newRepo);
  setReposToStorage(repos);
  return { data: newRepo, error: null };
}

export function updateGithubRepo(
  id: number,
  args: Partial<GithubRepoInsert>
): { data: GithubRepoRow | null; error: null } {
  const repos = getReposFromStorage();
  const idx = repos.findIndex((r) => r.id === id);
  if (idx === -1) return { data: null, error: null };
  repos[idx] = { ...repos[idx], ...args };
  setReposToStorage(repos);
  return { data: repos[idx], error: null };
}

export function deleteGithubRepo(id: number): {
  data: GithubRepoRow | null;
  error: null;
} {
  const repos = getReposFromStorage();
  const idx = repos.findIndex((r) => r.id === id);
  if (idx === -1) return { data: null, error: null };
  const [deleted] = repos.splice(idx, 1);
  setReposToStorage(repos);
  return { data: deleted, error: null };
}
