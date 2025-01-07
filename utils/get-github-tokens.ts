"use server";

import { resourcesApi } from "@/apis/resources";
import { GithubTokensRow, supabaseApi } from "@/apis/supabase";
import { adminClient } from "@/supabase/clients/admin";

export async function getGithubTokensUtility(
  userId: string
): Promise<{ data: GithubTokensRow | null; error: string | null }> {
  const supabaseAdminClient = adminClient();
  const res = await supabaseApi.github.tokens.get(supabaseAdminClient, userId);
  const { error } = res;
  let tokensData = res.data;

  if (error || !tokensData) {
    return { data: null, error: error?.message ?? "Tokens not found" };
  }

  const accessTokenExpired =
    new Date(tokensData.access_token_expires_in) < new Date();

  if (accessTokenExpired) {
    const newTokensData = await resourcesApi.github.refreshAccessToken(
      tokensData.refresh_token
    );

    if ("error" in newTokensData) {
      return { data: null, error: newTokensData.error };
    }

    tokensData = {
      ...tokensData,
      access_token: newTokensData.access_token,
      access_token_expires_in: newTokensData.expires_in,
      refresh_token: newTokensData.refresh_token,
      refresh_token_expires_in: newTokensData.refresh_token_expires_in,
    };

    const { error } = await supabaseApi.github.tokens.update(
      supabaseAdminClient,
      {
        id: userId,
        access_token: tokensData.access_token,
        access_token_expires_in: tokensData.access_token_expires_in,
        refresh_token: tokensData.refresh_token,
        refresh_token_expires_in: tokensData.refresh_token_expires_in,
      }
    );

    if (error) {
      return { data: null, error: error.message };
    }
  }

  return { data: tokensData, error: null };
}
