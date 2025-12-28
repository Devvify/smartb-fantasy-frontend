"use client";

import Link from "next/link";
import { Fragment } from "react";
import styles from "./PageHeader.module.css";

export default function PageHeader({ breadcrumbs, title }) {
  return (
    <div className={styles.pageHeader}>
      <nav className={styles.breadcrumb}>
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            {crumb.href ? (
              <Link href={crumb.href} className={styles.breadcrumbLink}>
                {crumb.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className={styles.breadcrumbSeparator}>/</span>
            )}
          </Fragment>
        ))}
      </nav>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}
