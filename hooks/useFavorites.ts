"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";

const STORAGE_KEY = "sourcelab:favorites";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("sl:favorites-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sl:favorites-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(STORAGE_KEY) || "[]";
  } catch (e) {
    console.warn("localStorage unavailable:", e);
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const favorites = useMemo<string[]>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [raw]);

  const toggleFavorite = useCallback((id: string) => {
    try {
      const currentRaw = getSnapshot();
      const current: string[] = JSON.parse(currentRaw);
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("sl:favorites-updated"));
    } catch (e) {
      console.warn("Failed to update favorites in localStorage:", e);
    }
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, isLoaded: true };
}
