import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

import { adminClient } from "@/supabase/clients/admin";
import { supabaseApi } from "@/apis/supabase";
import { serverClient } from "@/supabase/clients/server";
import { resourcesApi } from "@/apis/resources";

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
    const supabaseAdminClient = adminClient();

    const { user } = await supabaseApi.auth.getUser(supabaseClient);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { data: tokensData, error } = await supabaseApi.github.getTokens(
      supabaseAdminClient,
      user.id
    );

    if (error || !tokensData) {
      return NextResponse.json(
        { error: "Unable to fetch tokens" },
        { status: 500 }
      );
    }

    const accessTokenExpired =
      new Date(tokensData.access_token_expires_in) < new Date();

    if (accessTokenExpired) {
      const newTokensData = await resourcesApi.github.refreshAccessToken(
        tokensData.refresh_token
      );

      const { error } = await supabaseApi.github.updateTokens(
        supabaseAdminClient,
        {
          id: user.id,
          access_token: newTokensData.access_token,
          access_token_expires_in: newTokensData.expires_in,
          refresh_token: newTokensData.refresh_token,
          refresh_token_expires_in: newTokensData.refresh_token_expires_in,
        }
      );

      if (error) {
        return NextResponse.json(
          { error: "Unable to update tokens" },
          { status: 500 }
        );
      }
    }

    const octokit = new Octokit({
      auth: tokensData.access_token,
    });

    const { data } = await octokit.repos.getContent({
      owner: owner as string,
      repo: repo as string,
      path: "package.json",
    });

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const packageJson = JSON.parse(content);

    return NextResponse.json(packageJson);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
