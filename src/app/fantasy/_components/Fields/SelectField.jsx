"use client";

import styles from "./SelectField.module.css";

export default function SelectField({
  label,
  ariaLabel,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select",
}) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>{label}</label>

      <div className={styles.field}>
        <select
          className={styles.select}
          aria-label={ariaLabel || label}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <span className={styles.caret} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
