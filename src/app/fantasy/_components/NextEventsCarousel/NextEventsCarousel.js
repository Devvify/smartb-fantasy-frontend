"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./NextEventsCarousel.module.css";
import { fetchNextJumpSport } from "@/lib/api/nextJumpSport";
import Image from "next/image";

// Constants
const FALLBACK_TZ = "Asia/Dhaka";
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

// Utility functions
const getStableId = (e) =>
  String(
    e.eventId ??
      e.EventId ??
      e.id ??
      `${e.sportId || e.SportId || "s"}|${
        e.eventDate || e.EventDate || e.startTime || "t"
      }|${e.homeName || e.HomeTeamName || "h"}|${
        e.awayName || e.AwayTeamName || "a"
      }`
  );

const formatTime = (d) => {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
};

const getSportIcon = (id) =>
  ({ 4: "🏏", 8: "⚽", 9: "🏈", 10: "🏀", 12: "🏉" }[id] || "⚽");

const normalizeEvent = (e) => {
  const raw = e.eventDate || e.EventDate || e.startTime;
  const dt = raw ? new Date(raw) : null;
  const today = new Date();
  const isToday = dt && dt.toDateString() === today.toDateString();
  const date = dt
    ? isToday
      ? `Today ${String(dt.getDate()).padStart(2, "0")}/${String(
          dt.getMonth() + 1
        ).padStart(2, "0")}`
      : `${String(dt.getDate()).padStart(2, "0")}/${String(
          dt.getMonth() + 1
        ).padStart(2, "0")}`
    : "—";

  return {
    id: getStableId(e),
    league:
      e.tournamentName ||
      e.LeagueName ||
      e.league ||
      e.CompetitionName ||
      "Unknown League",
    icon: getSportIcon(e.sportId || e.SportId),
    date,
    time: dt ? formatTime(dt) : "—",
    home: e.homeName || e.HomeTeamName || e.homeTeam || "TBA",
    homeScore: e.score && e.score.localteam ? e.score.localteam.score : "-",
    away: e.awayName || e.AwayTeamName || e.awayTeam || "TBA",
    awayScore: e.score && e.score.visitorteam ? e.score.visitorteam.score : "-",
    homeFlag: e.homeFlag || null,
    awayFlag: e.awayFlag || null,
  };
};

export default function NextEventsCarousel() {
  const viewportRef = useRef(null);
  const scrollerRef = useRef(null);
  const autoRefreshTimerRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
  const defaultFlag =
    "https://au.testing.smartb.com.au/fantasy/images/player/defaultTeam.png";

  const timezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TZ;
    } catch {
      return FALLBACK_TZ;
    }
  }, []);

  // Calculate card width based on viewport
  const setCardWidth = useCallback(() => {
    const v = viewportRef.current;
    if (!v) return;

    const w = v.clientWidth;
    let perView = 6; // default for xl

    if (w < 420) perView = 1;
    else if (w < 640) perView = 2;
    else if (w < 992) perView = 3;
    else if (w < 1200) perView = 4;
    else if (w < 1400) perView = 5;
    else perView = 6;

    v.style.setProperty("--card-w", `${Math.floor(w / perView)}px`);
  }, []);

  // Fetch events with error handling and retry
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setErr("");

    try {
      const raw = await fetchNextJumpSport({ type: "next", timezone });
      setEvents(raw.map(normalizeEvent));
      setRetryCount(0);
    } catch (e) {
      const errorMessage = e?.message || "Failed to load events.";
      setErr(errorMessage);
      setEvents([]);

      // Auto-retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, Math.pow(2, retryCount) * 1000);
      }
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        setCardWidth();
        if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
      });
    }
  }, [timezone, setCardWidth, retryCount]);

  // Initial load and retry effect
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Auto-refresh when tab is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadEvents();
      }
    };

    // Set up auto-refresh interval
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }

    autoRefreshTimerRef.current = setInterval(() => {
      if (!document.hidden) {
        loadEvents();
      }
    }, AUTO_REFRESH_INTERVAL);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadEvents]);

  // Handle window resize
  useEffect(() => {
    const onResize = () => {
      setCardWidth();

      // Maintain scroll alignment after resize
      const v = viewportRef.current;
      const s = scrollerRef.current;
      if (!v || !s) return;

      const cardW = parseInt(
        getComputedStyle(v).getPropertyValue("--card-w"),
        10
      );
      if (cardW > 0) {
        s.scrollLeft = Math.round(s.scrollLeft / cardW) * cardW;
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setCardWidth]);

  // Scroll by one page
  const scrollByPage = useCallback((dir) => {
    const v = viewportRef.current;
    const s = scrollerRef.current;
    if (!v || !s) return;
    s.scrollBy({ left: dir * v.clientWidth, behavior: "smooth" });
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByPage(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByPage(1);
      }
    },
    [scrollByPage]
  );

  // Manual retry handler
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    loadEvents();
  }, [loadEvents]);

  return (
    <section
      className={styles.strip}
      aria-label="Next events carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.label} role="heading" aria-level="2">
        Next events
      </div>

      <button
        className={styles.arrow}
        onClick={() => scrollByPage(-1)}
        aria-label="Scroll to previous events"
        disabled={loading}
        type="button"
      >
        ‹
      </button>

      <div className={styles.viewport} ref={viewportRef}>
        <div
          className={styles.scroller}
          ref={scrollerRef}
          role="region"
          aria-live="polite"
          aria-label="Events list"
        >
          {loading && <div className={styles.blankState} aria-hidden="true" />}

          {!loading && err && (
            <div className={styles.state} role="alert">
              <p>{err}</p>
              <button
                onClick={handleRetry}
                className={styles.retryButton}
                type="button"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !err && events.length === 0 && (
            <div className={styles.state}>No upcoming events</div>
          )}

          {!loading &&
            !err &&
            events.map((e) => (
              <article key={e.id} className={styles.card} data-event-id={e.id}>
                <div className={styles.leagueRow}>
                  <span className={styles.leagueBall} aria-hidden="true">
                    {e.icon}
                  </span>
                  <span className={styles.leagueName}>{e.league}</span>
                </div>

                <div className={styles.metaRow}>
                  <time className={styles.date} dateTime={e.date}>
                    {e.date}
                  </time>
                  <time className={styles.time}>{e.time}</time>
                </div>

                <div className={styles.teams}>
                  <div className={styles.teamRow}>
                    <div className={styles.teamLeft}>
                      <span className={styles.teamLogo} aria-hidden="true">
                        <Image
                          src={
                            e.homeFlag
                              ? `${MEDIA_URL}${e.homeFlag}`
                              : defaultFlag
                          }
                          alt={`${e.home} flag`}
                          width={22}
                          height={22}
                        />
                      </span>
                      <span className={styles.teamName}>{e.home}</span>
                    </div>
                    <span
                      className={styles.score}
                      aria-label={`Score: ${e.homeScore}`}
                    >
                      {e.homeScore}
                    </span>
                  </div>

                  <div className={styles.teamRow}>
                    <div className={styles.teamLeft}>
                      <span className={styles.teamLogo} aria-hidden="true">
                        <Image
                          src={
                            e.awayFlag
                              ? `${MEDIA_URL}${e.awayFlag}`
                              : defaultFlag
                          }
                          alt={`${e.away} flag`}
                          width={22}
                          height={22}
                        />
                      </span>
                      <span className={styles.teamName}>{e.away}</span>
                    </div>
                    <span
                      className={styles.score}
                      aria-label={`Score: ${e.awayScore}`}
                    >
                      {e.awayScore}
                    </span>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>

      <button
        className={styles.arrow}
        onClick={() => scrollByPage(1)}
        aria-label="Scroll to next events"
        disabled={loading}
        type="button"
      >
        ›
      </button>
    </section>
  );
}
