import { Theme } from "@/shared/types";
import { ThemeProvider, ThemeProviderProps, useTheme } from "next-themes";
import { useEffect } from "react";

export function NextThemesProvider({ children, ...rest }: ThemeProviderProps) {
  return (
    <ThemeProvider {...rest}>
      <ThemeCookie />
      {children}
    </ThemeProvider>
  );
}

function ThemeCookie() {
  const theme = useTheme().theme as Theme;

  useEffect(() => {
    document.cookie = generateThemeCookie(theme);
  }, [theme]);

  return null;
}

function generateThemeCookie(theme: Theme) {
  const maxAge = 60 * 60 * 24 * 365; // 1 year

  return `theme=${theme};max-age=${maxAge};path=/;SameSite=Lax`;
}
