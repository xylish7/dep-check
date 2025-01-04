"use client";

import { NextUISystemProvider } from "./nextui-system";
import { NextThemesProvider } from "./next-themes";
import { NotificationProvider } from "./notification";
import { ThemeProviderProps } from "next-themes";
import { PostHogProvider } from "./posthog";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps: Partial<ThemeProviderProps>;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <PostHogProvider>
      <NextUISystemProvider>
        <NextThemesProvider {...themeProps}>
          <NotificationProvider>{children}</NotificationProvider>
        </NextThemesProvider>
      </NextUISystemProvider>
    </PostHogProvider>
  );
}
