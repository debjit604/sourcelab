"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";

const STORAGE_KEY = "sourcelab:recent";
const MAX_RECENT = 10;

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("sl:recent-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sl:recent-updated", callback);
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

export function useRecent() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const recent = useMemo<string[]>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [raw]);

  const push = useCallback((toolId: string) => {
    if (!toolId) return;
    try {
      const currentRaw = getSnapshot();
      const current: string[] = JSON.parse(currentRaw);
      const filtered = current.filter((id) => id !== toolId);
      const next = [toolId, ...filtered].slice(0, MAX_RECENT);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("sl:recent-updated"));
    } catch (e) {
      console.warn("Failed to update recent in localStorage:", e);
    }
  }, []);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("sl:recent-updated"));
    } catch (e) {
      console.warn("Failed to clear recent in localStorage:", e);
    }
  }, []);

  return { recent, push, clear, isLoaded: true };
}
