"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Dark mode is default locked
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    // Keep dark default, but support system/light toggle if needed
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-xl text-[var(--sl-muted)] hover:text-[var(--sl-text)] hover:bg-[var(--sl-surface)] border border-transparent hover:border-[var(--sl-border)] transition-colors"
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
