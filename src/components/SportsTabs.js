'use client';

import { useState } from 'react';

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

export default function SportsTabs({ activeSport, onSportChange }) {
  return (
    <div className="sports-tabs">
      <div className="tabs-container">
        {sports.map((sport) => (
          <button
            key={sport.id}
            className={`sport-tab ${activeSport === sport.id ? 'active' : ''} ${sport.comingSoon ? 'coming-soon' : ''}`}
            onClick={() => !sport.comingSoon && onSportChange(sport.id)}
            disabled={sport.comingSoon}
          >
            <span className="sport-icon">{sport.icon}</span>
            <span className="sport-name">{sport.name}</span>
            {sport.comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
