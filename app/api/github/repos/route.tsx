import { supabaseApi } from "@/apis/supabase";
import { serverClient } from "@/supabase/clients/server";
import { getGithubTokensUtility } from "@/utils/get-github-tokens";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabaseClient = await serverClient();

    const { user } = await supabaseApi.auth.getUser(supabaseClient);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { data: tokensData, error } = await getGithubTokensUtility(user.id);

    if (error || !tokensData) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const octokit = new Octokit({
      auth: tokensData.access_token,
    });

    const { data } = await octokit.repos.listForAuthenticatedUser();

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
