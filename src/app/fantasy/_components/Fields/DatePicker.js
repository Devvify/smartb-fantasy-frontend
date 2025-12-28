"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import styles from "./DatePicker.module.css";

/**
 * Parse "YYYY-MM-DD" safely into a local Date (no timezone drift).
 */
function parseYMDToLocalDate(ymd) {
  if (!ymd || typeof ymd !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const date = new Date(y, mo, d);
  // Guard invalid dates (e.g. 2025-02-31)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function formatToYMD(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatToDDMMYYYY(date) {
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/yyyy",
  enabledDates = null,
  onOpen,
  onDateSelect,
  loading = false, // optional
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Keep month as "first day of month" to simplify grid calculations
  const [currentMonth, setCurrentMonth] = useState(() => {
    const initial = parseYMDToLocalDate(value);
    const base = initial ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() =>
    parseYMDToLocalDate(value)
  );

  const pickerRef = useRef(null);

  // Convert enabledDates to Set for O(1) lookups
  const enabledSet = useMemo(() => {
    if (!Array.isArray(enabledDates)) return null;
    return new Set(enabledDates);
  }, [enabledDates]);

  // Sync internal selectedDate & month if parent value changes
  useEffect(() => {
    const next = parseYMDToLocalDate(value);
    setSelectedDate(next);

    // Optional behavior: if value changes while closed, align month view to it
    if (next && !isOpen) {
      setCurrentMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  }, [value, isOpen]);

  // Close on outside click + Escape
  useEffect(() => {
    const onMouseDown = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const daysOfWeek = useMemo(() => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], []);

  const requestMonth = useCallback(
    (monthDate) => {
      if (!onOpen) return;
      const month = monthDate.getMonth() + 1;
      const year = monthDate.getFullYear();
      onOpen(month, year);
    },
    [onOpen]
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    requestMonth(currentMonth);
  }, [currentMonth, requestMonth]);

  const goToPreviousMonth = useCallback(() => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
    requestMonth(newMonth);
  }, [currentMonth, requestMonth]);

  const goToNextMonth = useCallback(() => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
    requestMonth(newMonth);
  }, [currentMonth, requestMonth]);

  const isToday = useCallback(
    (cellDate) => {
      const today = new Date();
      return (
        cellDate.getFullYear() === today.getFullYear() &&
        cellDate.getMonth() === today.getMonth() &&
        cellDate.getDate() === today.getDate()
      );
    },
    []
  );

  const isSelected = useCallback(
    (cellDate) => {
      if (!selectedDate) return false;
      return (
        cellDate.getFullYear() === selectedDate.getFullYear() &&
        cellDate.getMonth() === selectedDate.getMonth() &&
        cellDate.getDate() === selectedDate.getDate()
      );
    },
    [selectedDate]
  );

  const isEnabled = useCallback(
    (cellDate) => {
      if (!enabledSet) return true; // no restrictions
      return enabledSet.has(formatToYMD(cellDate));
    },
    [enabledSet]
  );

  /**
   * Build 6x7 grid of actual Date objects.
   * Week starts Sunday (matches your header).
   */
  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstOfMonth.getDay(); // 0..6
    const gridStart = new Date(year, month, 1 - startDayOfWeek);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + i
      );

      cells.push({
        date: d,
        isCurrentMonth: d.getMonth() === month && d.getFullYear() === year,
      });
    }
    return cells;
  }, [currentMonth]);

  const handleDateClick = useCallback(
    (cellDate) => {
      if (!isEnabled(cellDate)) return;

      setSelectedDate(cellDate);

      const ymd = formatToYMD(cellDate);
      onChange?.(ymd);
      onDateSelect?.(ymd);

      setIsOpen(false);
    },
    [isEnabled, onChange, onDateSelect]
  );

  const inputValue = selectedDate ? formatToDDMMYYYY(selectedDate) : "";

  return (
    <div className={styles.datePickerWrapper} ref={pickerRef}>
      <div
        className={styles.inputWrapper}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen();
        }}
      >
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          className={styles.dateInput}
          readOnly
        />
        <svg
          className={styles.calendarIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2z"
            fill="currentColor"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.calendarPopup} role="dialog" aria-label="Calendar">
          <div className={styles.calendarHeader}>
            <button
              type="button"
              onClick={goToPreviousMonth}
              className={styles.navButton}
              aria-label="Previous month"
              disabled={loading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                />
              </svg>
            </button>

            <span className={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>

            <button
              type="button"
              onClick={goToNextMonth}
              className={styles.navButton}
              aria-label="Next month"
              disabled={loading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                />
              </svg>
            </button>
          </div>

          <div className={styles.daysOfWeek}>
            {daysOfWeek.map((d) => (
              <div key={d} className={styles.dayOfWeek}>
                {d}
              </div>
            ))}
          </div>

          {/* Optional lightweight loading indicator */}
          {loading && (
            <div className={styles.loadingRow} aria-live="polite">
              Loading dates...
            </div>
          )}

          <div className={styles.daysGrid}>
            {days.map((cell, idx) => {
              const enabled = isEnabled(cell.date);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateClick(cell.date)}
                  disabled={!enabled || loading}
                  className={[
                    styles.dayCell,
                    !cell.isCurrentMonth ? styles.otherMonth : "",
                    isToday(cell.date) ? styles.today : "",
                    isSelected(cell.date) ? styles.selected : "",
                    !enabled ? styles.disabled : "",
                  ].join(" ")}
                  aria-pressed={isSelected(cell.date)}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
