"use client";

import { env, posthogHost, posthogKey } from "@/config/env";
import { storage } from "@/utils/local-storage";
import posthog from "posthog-js";
import { PostHogProvider as PostHogProviderJs } from "posthog-js/react";

if (typeof window !== "undefined" && posthogKey && env === "production") {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: "identified_only",
    persistence:
      storage.getCookiesConsent() === "yes" ? "localStorage+cookie" : "memory",
  });
}

interface PostHogProviderProps {
  children: React.ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  return <PostHogProviderJs client={posthog}>{children}</PostHogProviderJs>;
}
