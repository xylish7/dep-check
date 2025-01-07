"use server";

import { githubAppClientId, githubAppClientSecret } from "@/config/env";

export type OAuthAccessTokenRes =
  | {
      access_token: string;
      expires_in: number;
      refresh_token: string;
      refresh_token_expires_in: number;
      token_type: string;
      scope: string;
    }
  | { error: string };

export async function getGithubAccessToken(
  code: string
): Promise<OAuthAccessTokenRes> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
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
  });

  return (await response.json()) as OAuthAccessTokenRes;
}

export async function refreshGithubAccessToken(
  refreshToken: string
): Promise<OAuthAccessTokenRes> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: githubAppClientId,
      client_secret: githubAppClientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return (await response.json()) as OAuthAccessTokenRes;
}
