"use client";
import styles from "./SportTabs.module.css";

import AllIcon from "@/assets/tab-icons/all.svg";
import AllActiveIcon from "@/assets/tab-icons/all-active.svg";
import CricketIcon from "@/assets/tab-icons/cricket.svg";
import CricketActiveIcon from "@/assets/tab-icons/cricket-active.svg";
import FootballIcon from "@/assets/tab-icons/football.svg";
import FootballActiveIcon from "@/assets/tab-icons/football-active.svg";
import BasketballIcon from "@/assets/tab-icons/basketball.svg";
import BasketballActiveIcon from "@/assets/tab-icons/basketball-active.svg";
import AussieRulesIcon from "@/assets/tab-icons/aussie-rules.svg";
import AussieRulesActiveIcon from "@/assets/tab-icons/aussie-rules-active.svg";
import RugbyLeagueIcon from "@/assets/tab-icons/rugby-league.svg";
import RugbyLeagueActiveIcon from "@/assets/tab-icons/rugby-league-active.svg";
import BaseballIcon from "@/assets/tab-icons/baseball.svg";
import AmericanFootballIcon from "@/assets/tab-icons/american-football.svg";
import IceHockeyIcon from "@/assets/tab-icons/ice-hockey.svg";

// Icon mapping for sports
const iconMap = {
  Cricket: { Icon: CricketIcon, ActiveIcon: CricketActiveIcon },
  Soccer: { Icon: FootballIcon, ActiveIcon: FootballActiveIcon },
  Basketball: { Icon: BasketballIcon, ActiveIcon: BasketballActiveIcon },
  "Australian Rules": {
    Icon: AussieRulesIcon,
    ActiveIcon: AussieRulesActiveIcon,
  },
  "Rugby League": { Icon: RugbyLeagueIcon, ActiveIcon: RugbyLeagueActiveIcon },
  Baseball: { Icon: BaseballIcon, ActiveIcon: BaseballIcon },
  "American Football": {
    Icon: AmericanFootballIcon,
    ActiveIcon: AmericanFootballIcon,
  },
  "Ice Hockey": { Icon: IceHockeyIcon, ActiveIcon: IceHockeyIcon },
};

// Sport name to ID mapping
const sportNameToId = {
  Cricket: "cricket",
  Soccer: "football",
  Basketball: "basketball",
  "Australian Rules": "aussierules",
  "Rugby League": "rugbyleague",
  Baseball: "baseball",
  "American Football": "americanfootball",
  "Ice Hockey": "icehockey",
};

// Coming soon sports to add
const comingSoonSports = [
  { sportName: "Baseball", upcomingFixturesCount: 0 },
  { sportName: "American Football", upcomingFixturesCount: 0 },
  { sportName: "Ice Hockey", upcomingFixturesCount: 0 },
];

export default function SportTabs({ activeSport, onSportChange, sportData }) {
  // Process sportData to create tabs array
  const sports = (() => {
    // Always add "All" tab first
    const tabs = [
      {
        id: "all",
        smallId: "all",
        name: "ALL",
        Icon: AllIcon,
        ActiveIcon: AllActiveIcon,
      },
    ];

    // Add sports from API data
    if (sportData?.result) {
      sportData.result.forEach((sport) => {
        const icons = iconMap[sport.sportName];
        const smallId = sportNameToId[sport.sportName];

        if (icons && smallId) {
          tabs.push({
            id: smallId,
            smallId: smallId,
            name: sport.sportName.toUpperCase(),
            Icon: icons.Icon,
            ActiveIcon: icons.ActiveIcon,
            upcomingFixturesCount: sport.upcomingFixturesCount,
            apiId: sport.id,
          });
        }
      });
    }

    // Add coming soon sports
    comingSoonSports.forEach((sport) => {
      const icons = iconMap[sport.sportName];
      const smallId = sportNameToId[sport.sportName];

      if (icons && smallId) {
        tabs.push({
          id: smallId,
          smallId: smallId,
          name: sport.sportName.toUpperCase(),
          Icon: icons.Icon,
          ActiveIcon: icons.ActiveIcon,
          comingSoon: true,
          upcomingFixturesCount: 0,
        });
      }
    });

    return tabs;
  })();

  return (
    <div className={styles.wrap} role="tablist" aria-label="Sports tabs">
      <div className={styles.scroller}>
        {sports.map(({ id, name, Icon, ActiveIcon, comingSoon, apiId }) => {
          const isActive = activeSport === id;
          const IconComponent = isActive ? ActiveIcon : Icon;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={comingSoon || undefined}
              disabled={!!comingSoon}
              onClick={() => !comingSoon && onSportChange(apiId, id)}
              className={[
                styles.tab,
                isActive ? styles.tabActive : "",
                comingSoon ? styles.tabDisabled : "",
              ].join(" ")}
            >
              <span className={styles.iconWrap} aria-hidden="true">
                <IconComponent className={styles.icon} />
              </span>

              <span
                className={`${styles.label} ${
                  isActive ? styles.labelActive : ""
                }`}
              >
                {name}
              </span>

              {comingSoon && <span className={styles.badge}>Coming Soon</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
