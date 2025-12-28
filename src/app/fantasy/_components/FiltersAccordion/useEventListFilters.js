"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE =
  "https://au.testing.smartb.com.au/fantasy-ms/api/v1/fantasy/event-list/filters";

function buildQuery({ status, timezone, params }) {
  const q = new URLSearchParams();
  q.set("status", status);

  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "") return;

    // ✅ arrays => comma-separated (team_id=240,253)
    if (Array.isArray(v)) {
      if (v.length === 0) return;
      q.set(k, v.join(","));
      return;
    }

    q.set(k, String(v));
  });

  // Only add timezone where needed by the API
  if (params?.start_time || (params?.month && params?.year)) {
    q.set("timezone", timezone);
  }

  return q.toString();
}

function mergeKeepingMasters(prev, next, params) {
  const isScoped = !!params?.tournament_id || !!params?.team_id;

  // Normal replace when not scoped
  if (!isScoped) return next;

  // If scoped, keep master sports/tournaments from previous state if available
  if (!prev) return next;

  return {
    ...prev,
    ...next,
    sports: prev.sports ?? next?.sports,
    tournaments: prev.tournaments ?? next?.tournaments,
  };
}

export function useEventListFilters(status = "upcoming") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const abortRef = useRef(null);
  const cacheRef = useRef(new Map());

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchFilters = useCallback(
    async (params, { cache = true } = {}) => {
      const key = JSON.stringify({ status, tz: timezone, params });

      // ✅ IMPORTANT: apply merge even for cache hits
      if (cache && cacheRef.current.has(key)) {
        const cached = cacheRef.current.get(key);
        setData((prev) => mergeKeepingMasters(prev, cached, params));
        return cached;
      }

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const qs = buildQuery({ status, timezone, params });
        const res = await fetch(`${API_BASE}?${qs}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);

        const json = await res.json();
        const next = json?.data ?? null;

        cacheRef.current.set(key, next);

        // ✅ IMPORTANT: apply merge for network response too
        setData((prev) => mergeKeepingMasters(prev, next, params));

        return next;
      } catch (e) {
        if (e?.name !== "AbortError") console.error(e);
        return null;
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [status, timezone]
  );

  const reset = useCallback(() => setData(null), []);
  const clearCache = useCallback(() => cacheRef.current.clear(), []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { data, loading, fetchFilters, reset, clearCache };
}
