import { GithubRepoRow } from "../local-storage";

export async function getUpdates(repo: GithubRepoRow): Promise<{
  data: GithubRepoRow | null;
  error: unknown | null;
}> {
  try {
    const response = await fetch("/api/dependencies/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo }),
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
