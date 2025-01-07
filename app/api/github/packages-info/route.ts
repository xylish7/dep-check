// import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

import { supabaseApi } from "@/apis/supabase";
import { serverClient } from "@/supabase/clients/server";
import { getGithubTokensUtility } from "@/utils/get-github-tokens";

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as { repo: string; owner: string };
  const { owner, repo } = payload;

  if (!owner || !repo) {
    return NextResponse.json(
      { message: "Owner and repo are required" },
      { status: 404 }
    );
  }

  try {
    const supabaseClient = await serverClient();

    const { user } = await supabaseApi.auth.getUser(supabaseClient);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { data: tokensData, error } = await getGithubTokensUtility(user.id);

    if (error || !tokensData) {
      return NextResponse.json(
        { error: "Unable to fetch tokens" },
        { status: 500 }
      );
    }

    // const octokit = new Octokit({
    //   auth: tokensData.access_token,
    // });

    // const { data } = await octokit.repos.getContent({
    //   owner: owner as string,
    //   repo: repo as string,
    //   path: "package.json",
    // });

    // const content = Buffer.from(data.content, "base64").toString("utf-8");
    // const packageData = JSON.parse(content);

    return NextResponse.json({ data: "packageData" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
