import Image from "next/image";
import styles from "./CompetitionCard.module.css";

export default function CompetitionCard({ competition }) {
  const {
    eventName,
    homeTeam,
    awayTeam,
    startTime,
    status,
    prizePool,
    entryCoin,
    tournament,
    userEntry,
    prizePoolFirst,
  } = competition;

  const formatDate = (date) => {
    const d = new Date(date);
    return d
      .toLocaleDateString("en-AU", { day: "2-digit", month: "short" })
      .toUpperCase();
  };

  const formatTime = (date) => {
    if (!date) return "TBA";
    const d = new Date(date);
    return d.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={styles.competitionCard}>
      <div className={styles.cardHeader}>
        <span className={styles.leagueName}>{tournament?.name || "TBA"}</span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.teamsSection}>
          <div className={styles.team}>
            <div className={styles.teamLogo}>
              <Image
                src="/images/default-team.png"
                alt={homeTeam?.name || "TBA"}
                width={90}
                height={90}
              />
            </div>
            <span className={styles.teamName}>{homeTeam?.name || "TBA"}</span>
          </div>

          <div className={styles.matchDetails}>
            <div className={styles.matchDate}>{formatDate(startTime)}</div>
            <div className={styles.matchTime}>{formatTime(startTime)}</div>
            <div
              className={`${styles.matchStatus} ${
                styles[status?.toLowerCase()]
              }`}
            >
              {status?.toUpperCase() || "UPCOMING"}
            </div>
          </div>

          <div className={styles.team}>
            <div className={styles.teamLogo}>
              <Image
                src="/images/default-team.png"
                alt={awayTeam?.name || "TBA"}
                width={90}
                height={90}
              />
            </div>
            <span className={styles.teamName}>{awayTeam?.name || "TBA"}</span>
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
              <span>{entryCoin || 100}</span>
            </div>
          </div>

          <button className={styles.btnEnter} disabled={status === "CLOSED"}>
            ENTER COMP
          </button>

          <div className={styles.entriesSection}>
            <span className={styles.label}>ENTRIES</span>
            <div className={styles.entriesValue}>
              <span>{userEntry || 0}</span>
            </div>
          </div>

          <div className={styles.firstPrizeSection}>
            <span className={styles.label}>1ST PRIZE</span>
            <div className={styles.firstPrizeValue}>
              <span className={styles.coinIcon}>🪙</span>
              <span>{prizePoolFirst || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
