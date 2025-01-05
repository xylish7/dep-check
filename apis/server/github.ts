type GetIsAuthorizedResponse =
  | { data: { authorized: boolean }; error: null }
  | { data: null; error: unknown };

export async function getIsAuthorized(): Promise<GetIsAuthorizedResponse> {
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
