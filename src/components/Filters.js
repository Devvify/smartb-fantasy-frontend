'use client';

export default function Filters({ contestType, onContestTypeChange }) {
  return (
    <div className="filters-section">
      <div className="contest-type-toggle">
        <button
          className={`toggle-btn ${contestType === 'paid' ? 'active' : ''}`}
          onClick={() => onContestTypeChange('paid')}
        >
          <span className="coin-icon">🪙</span>
          COMPETITIONS
        </button>
        <button
          className={`toggle-btn ${contestType === 'free' ? 'active' : ''}`}
          onClick={() => onContestTypeChange('free')}
        >
          FREE COMPETITIONS
        </button>
      </div>
      
      <button className="filter-btn">
        Filters
        <span className="filter-icon">⚙️</span>
      </button>
    </div>
  );
}
