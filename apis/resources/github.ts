"use-server";

import { githubAppClientId, githubAppClientSecret } from "@/config/env";

export async function getGithubAccessToken(code: string) {
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

  return (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    token_type: string;
    scope: string;
  };
}

export async function refreshGithubAccessToken(refreshToken: string) {
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

  return (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    token_type: string;
    scope: string;
  };
}
