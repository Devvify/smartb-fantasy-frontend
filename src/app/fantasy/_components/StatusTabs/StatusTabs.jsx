"use client";

import styles from "./StatusTabs.module.css";

const statusOptions = [
  { id: "upcoming", label: "UPCOMING" },
  { id: "inprogress", label: "LIVE" },
  { id: "finished", label: "COMPLETED" },
];

export default function StatusTabs({ activeStatus, onStatusChange }) {
  return (
    <div className={styles.wrap} role="tablist" aria-label="Status tabs">
      {statusOptions.map((s) => {
        const isActive = activeStatus === s.id;

        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
            onClick={() => onStatusChange(s.id)}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
