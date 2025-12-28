'use client';

import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>All Competitions</h1>
          </div>

          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading competitions...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
