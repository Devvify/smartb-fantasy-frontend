import Image from 'next/image';
import styles from './CompetitionCard.module.css';

export default function CompetitionCard({ competition }) {
  const {
    league,
    homeTeam,
    awayTeam,
    matchDate,
    matchTime,
    status,
    prizePool,
    entryCoins,
  } = competition;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' }).toUpperCase();
  };

  const formatTime = (time) => {
    return time || 'TBA';
  };

  return (
    <div className={styles.competitionCard}>
      <div className={styles.cardHeader}>
        <span className={styles.leagueName}>{league || 'TBA'}</span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.teamsSection}>
          <div className={styles.team}>
            <div className={styles.teamLogo}>
              <Image 
                src="/images/default-team.svg" 
                alt={homeTeam || 'TBA'}
                width={40}
                height={40}
              />
            </div>
            <span className={styles.teamName}>{homeTeam || 'TBA'}</span>
          </div>

          <div className={styles.matchDetails}>
            <div className={styles.matchDate}>{formatDate(matchDate)}</div>
            <div className={styles.matchTime}>{formatTime(matchTime)}</div>
            <div className={`${styles.matchStatus} ${styles[status?.toLowerCase()]}`}>
              {status || 'UPCOMING'}
            </div>
          </div>

          <div className={styles.team}>
            <div className={styles.teamLogo}>
              <Image 
                src="/images/default-team.svg" 
                alt={awayTeam || 'TBA'}
                width={40}
                height={40}
              />
            </div>
            <span className={styles.teamName}>{awayTeam || 'TBA'}</span>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.prizeSection}>
            <span className={styles.label}>PRIZE POOL</span>
            <div className={styles.prizeValue}>
              <span className={styles.coinIcon}>🪙</span>
              <span>{prizePool || 0}</span>
            </div>
          </div>

          <div className={styles.entrySection}>
            <span className={styles.label}>ENTRY COINS</span>
            <div className={styles.entryValue}>
              <span className={styles.coinIcon}>🪙</span>
              <span>{entryCoins || 100}</span>
            </div>
          </div>

          <button className={styles.btnEnter} disabled={status === 'CLOSED'}>
            ENTER COMP
          </button>

          <div className={styles.entriesSection}>
            <span className={styles.label}>ENTRIES</span>
            <div className={styles.entriesValue}>
              <span>{competition.entries || 0}</span>
            </div>
          </div>

          <div className={styles.firstPrizeSection}>
            <span className={styles.label}>1ST PRIZE</span>
            <div className={styles.firstPrizeValue}>
              <span className={styles.coinIcon}>🪙</span>
              <span>{competition.firstPrize || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

