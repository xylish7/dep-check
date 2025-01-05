import { NextResponse } from "next/server";

import { adminClient } from "@/supabase/clients/admin";
import { serverClient } from "@/supabase/clients/server";
import { supabaseApi } from "@/apis/supabase";
import { resourcesApi } from "@/apis/resources";

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
    const tokensData = await resourcesApi.github.getAccessToken(code);

    const { error } = await supabaseApi.github.updateTokens(
      supabaseAdminClient,
      {
        id: user.id,
        access_token: tokensData.access_token,
        access_token_expires_in: tokensData.expires_in,
        refresh_token: tokensData.refresh_token,
        refresh_token_expires_in: tokensData.refresh_token_expires_in,
      }
    );

    if (error) {
      return NextResponse.redirect(`${origin}/server-error`);
    }

    return NextResponse.redirect(`${origin}/account`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(`${origin}/server-error`);
  }
}
