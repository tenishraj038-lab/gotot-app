"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("gotot_theme") as Theme | null;
    const initial = stored || defaultTheme;
    setThemeState(initial);

    const resolve = (t: Theme) => {
      if (t === "dark") return "dark";
      if (t === "light") return "light";
      if (enableSystem) return getSystemTheme();
      return "light";
    };

    const resolved = resolve(initial);
    setResolvedTheme(resolved);
    root.setAttribute(attribute, resolved);

    if (disableTransitionOnChange) {
      root.classList.add("no-transitions");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.classList.remove("no-transitions");
        });
      });
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    setThemeState(newTheme);
    localStorage.setItem("gotot_theme", newTheme);

    const resolve = (t: Theme) => {
      if (t === "dark") return "dark";
      if (t === "light") return "light";
      if (enableSystem) return getSystemTheme();
      return "light";
    };

    const resolved = resolve(newTheme);
    setResolvedTheme(resolved);
    root.setAttribute(attribute, resolved);
  };

  useEffect(() => {
    if (!enableSystem) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme !== "system") return;
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      document.documentElement.setAttribute(attribute, resolved);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, enableSystem, attribute]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}