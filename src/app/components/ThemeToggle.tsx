"use client";
import React from "react";

const THEME_KEY = "theme"; // 'light' | 'dark'

function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (theme === "dark") {
    html.setAttribute("data-theme", "dark");
    html.classList.add("dark");
  } else {
    html.removeAttribute("data-theme");
    html.classList.remove("dark");
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    try {
      const saved =
        (localStorage.getItem(THEME_KEY) as "light" | "dark") || null;
      const initial =
        saved ??
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      setTheme(initial);
      applyTheme(initial);
    } catch {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border- bg-white text-black shadow-sm hover:bg-zinc-50 dark:border-zinc-700/60 dark:bg-zinc-900 dark:text-dark dark:hover:bg-white"
    >
      <span className="text-lg" aria-hidden>
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
