import { githubAppClientId, githubAppClientSecret } from "@/config/env";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

import { adminClient } from "@/supabase/clients/admin";
import { serverClient } from "@/supabase/clients/server";
import { supabaseApi } from "@/supabase/api";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const supabaseClient = await serverClient();
  const supabaseAdminClient = adminClient();

  const { user } = await supabaseApi.auth.getUser(supabaseClient);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/server-error`);
  }

  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: githubAppClientId,
          client_secret: githubAppClientSecret,
          code,
        }),
      }
    );

    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      refresh_token_expires_in: number;
      token_type: string;
      scope: string;
    };

    const { error } = await supabaseApi.github.updateGithubTokens(
      supabaseAdminClient,
      user.id,

      {
        access_token: data.access_token,
        access_token_expires_at: data.expires_in,
        refresh_token: data.refresh_token,
        refresh_token_expires_in: data.refresh_token_expires_in,
        token_type: data.token_type,
        scope: data.scope,
      }
    );

    // const octokit = new Octokit({
    //   auth: data.access_token,
    // });

    return NextResponse.redirect(`${origin}/account`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(`${origin}/server-error`);
  }
}
