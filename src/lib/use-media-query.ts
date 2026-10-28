"use client";

import { useSyncExternalStore } from "react";

/** Mengikuti hasil media query. Di server selalu `false`, lalu menyesuaikan di browser. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
