import { Updates } from "../supabase";

export async function getUpdates(repoId: number): Promise<{
  data: Updates | null;
  error: unknown | null;
}> {
  try {
    const response = await fetch("/api/dependencies/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoId }),
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
