import { RestEndpointMethodTypes } from "@octokit/rest";

type GetIsAuthorizedResponse = {
  data: { authorized: boolean } | null;
  error: null | unknown;
};

export async function getIsGithubAuthorized(): Promise<GetIsAuthorizedResponse> {
  try {
    const response = await fetch("/api/github/is-authorized", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Unable to revalidate.");
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export type GetGithubReposResponse = {
  data:
    | null
    | RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"];
  error: null | unknown;
};

export async function getGithubRepos(): Promise<GetGithubReposResponse> {
  try {
    const response = await fetch("/api/github/repos", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Unable to revalidate.");
    }

    const data = await response.json();

    return { data: data.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
