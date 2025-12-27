'use client';

import { useState } from 'react';
import styles from './SportTabs.module.css';

const sports = [
  { id: 'all', name: 'ALL', icon: '🏆' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'football', name: 'FOOTBALL', icon: '⚽' },
  { id: 'basketball', name: 'BASKETBALL', icon: '🏀' },
  { id: 'aussierules', name: 'AUSSIE RULES', icon: '🏉' },
  { id: 'rugbyleague', name: 'RUGBY LEAGUE', icon: '🏉' },
  { id: 'baseball', name: 'BASEBALL', icon: '⚾', comingSoon: true },
  { id: 'americanfootball', name: 'AMERICAN FOOTBALL', icon: '🏈', comingSoon: true },
  { id: 'icehockey', name: 'ICE HOCKEY', icon: '🏒', comingSoon: true },
];

export default function SportTabs({ activeSport, onSportChange }) {
  return (
    <div className={styles.tabs}>
      <div className={styles.tabsContainer}>
        {sports.map((sport) => (
          <button
            key={sport.id}
            className={`${styles.tab} ${activeSport === sport.id ? styles.tabActive : ''} ${sport.comingSoon ? styles.tabDisabled : ''}`}
            onClick={() => !sport.comingSoon && onSportChange(sport.id)}
            disabled={sport.comingSoon}
          >
            <span className={styles.icon}>{sport.icon}</span>
            <span className={styles.name}>{sport.name}</span>
            {sport.comingSoon && <span className={styles.comingSoon}>Coming Soon</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
