"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Prevent conflict between next-themes and mui theme
const cache = createCache({ key: "css", prepend: true });

interface ThemeProviderProps {
  children: ReactNode;
}

// TODO: Remove Mui
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  // Wait to mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }

  // Adjust theme
  setTheme(localStorage.getItem("theme") ?? "dark");

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      <CacheProvider value={cache}>
        <MuiThemeProvider theme={createTheme()}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </CacheProvider>
    </NextThemeProvider>
  );
}
