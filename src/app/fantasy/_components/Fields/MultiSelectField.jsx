"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import styles from "./MultiSelectField.module.css";

export default function MultiSelectField({
  label,
  ariaLabel,
  value = [], // array of selected values
  onChange, // (nextArray) => void
  options = [], // [{ value, label }]
  disabled = false,
  placeholder = "Select",
  displayMode = "labels", // "labels" | "count"
  maxLabelItems = 2,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selectedValues = Array.isArray(value) ? value.map(String) : [];

  const valueToLabel = useMemo(() => {
    const map = new Map();
    options.forEach((o) => map.set(String(o.value), o.label));
    return map;
  }, [options]);

  const selectedLabels = useMemo(
    () => selectedValues.map((v) => valueToLabel.get(v) || v),
    [selectedValues, valueToLabel]
  );

  const displayText = useMemo(() => {
    if (selectedValues.length === 0) return placeholder;

    if (displayMode === "count") {
      return selectedValues.length === 1
        ? "1 selected"
        : `${selectedValues.length} selected`;
    }

    // labels mode (default)
    const shown = selectedLabels.slice(0, maxLabelItems);
    const rest = selectedLabels.length - shown.length;
    return rest > 0 ? `${shown.join(", ")} +${rest}` : shown.join(", ");
  }, [
    selectedValues.length,
    selectedLabels,
    placeholder,
    displayMode,
    maxLabelItems,
  ]);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggle = useCallback(
    (v) => {
      const key = String(v);
      const next = new Set(selectedValues);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onChange(Array.from(next));
    },
    [onChange, selectedValues]
  );

  const clearAll = useCallback(
    (e) => {
      e?.stopPropagation?.();
      onChange([]);
    },
    [onChange]
  );

  return (
    <div className={styles.group} ref={ref}>
      <label className={styles.label}>{label}</label>

      <div className={styles.field}>
        <button
          type="button"
          className={styles.trigger}
          aria-label={ariaLabel || label}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((x) => !x)}
        >
          <span
            className={
              selectedValues.length === 0 ? styles.placeholder : styles.value
            }
            title={selectedLabels.join(", ")}
          >
            {displayText}
          </span>

          <span className={styles.right}>
            {selectedValues.length > 0 && (
              <span
                role="button"
                aria-label="Clear selection"
                tabIndex={0}
                className={styles.clear}
                onClick={clearAll}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    clearAll(e);
                  }
                }}
              >
                ×
              </span>
            )}

            <span className={styles.caret} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
              </svg>
            </span>
          </span>
        </button>

        {open && !disabled && (
          <div
            className={styles.dropdown}
            role="listbox"
            aria-label={ariaLabel || label}
          >
            {options.length === 0 ? (
              <div className={styles.empty}>No options</div>
            ) : (
              options.map((o) => {
                const checked = selectedValues.includes(String(o.value));
                return (
                  <label key={o.value} className={styles.option}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(o.value)}
                    />
                    <span className={styles.optionLabel}>{o.label}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
