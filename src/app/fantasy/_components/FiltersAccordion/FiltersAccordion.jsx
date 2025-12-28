"use client";

import { useCallback, useMemo, useState } from "react";
import styles from "./FiltersAccordion.module.css";
import { useEventListFilters } from "./useEventListFilters";
import DatePicker from "../Fields/DatePicker";
import SelectField from "../Fields/SelectField";
import MultiSelectField from "../Fields/MultiSelectField";

const FALLBACK_SPORTS = [
  { value: "", label: "All Sports" },
  { value: "cricket", label: "Cricket" },
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "aussierules", label: "Aussie Rules" },
  { value: "rugbyleague", label: "Rugby League" },
];

const toOptions = (items) =>
  Array.isArray(items)
    ? items.map((x) => ({ value: String(x.id), label: x.name }))
    : [];

export default function FiltersAccordion({
  isOpen,
  onApply,
  onReset,
  filterOptions,
  loading,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedLeagues, setSelectedLeagues] = useState([]); // multi
  const [selectedTeams, setSelectedTeams] = useState([]); // multi

  const status = filterOptions?.status || "upcoming";
  const {
    data,
    loading: loadingServer,
    fetchFilters,
    reset,
  } = useEventListFilters(status);

  const primaryLeague = selectedLeagues[0] || ""; // used for dependent teams

  // server-first, fallback-second
  const sportsSrc = data?.sports ?? filterOptions?.data?.sports;
  const tournamentsSrc =
    data?.tournaments ?? filterOptions?.data?.leagues?.[selectedSport];
  const teamsSrc = data?.teams ?? filterOptions?.data?.teams?.[primaryLeague];

  const sportsOptions = useMemo(() => {
    return sportsSrc
      ? [{ value: "", label: "All Sports" }, ...toOptions(sportsSrc)]
      : FALLBACK_SPORTS;
  }, [sportsSrc]);

  const leagueOptions = useMemo(() => {
    if (!selectedSport) return [];
    if (!Array.isArray(tournamentsSrc)) return [];
    return tournamentsSrc[0]?.value
      ? tournamentsSrc
      : toOptions(tournamentsSrc);
  }, [selectedSport, tournamentsSrc]);

  const teamOptions = useMemo(() => {
    if (!selectedSport || !primaryLeague) return [];
    if (!Array.isArray(teamsSrc)) return [];
    return teamsSrc[0]?.value ? teamsSrc : toOptions(teamsSrc);
  }, [selectedSport, primaryLeague, teamsSrc]);

  const handleDateOpen = useCallback(
    (month, year) => {
      fetchFilters({
        month,
        year,
        sport_id: selectedSport || null,
        tournament_id: primaryLeague || null,
      });
    },
    [fetchFilters, selectedSport, primaryLeague]
  );

  const handleDateSelect = useCallback(
    (dateString) => {
      setSelectedDate(dateString);

      fetchFilters({
        start_time: dateString,
        sport_id: selectedSport || null,
        tournament_id: primaryLeague || null,
      });
    },
    [fetchFilters, selectedSport, primaryLeague]
  );

  const handleSportChange = useCallback(
    (sportId) => {
      setSelectedSport(sportId);
      setSelectedLeagues([]);
      setSelectedTeams([]);
      reset();

      if (sportId) {
        fetchFilters({ sport_id: sportId, start_time: selectedDate || null });
      } else if (selectedDate) {
        fetchFilters({ start_time: selectedDate });
      }
    },
    [fetchFilters, reset, selectedDate]
  );

  // leagueIds is an array because multiple=true
  const handleLeagueChange = useCallback(
    (leagueIds) => {
      setSelectedLeagues(leagueIds);
      setSelectedTeams([]); // teams depend on league

      const nextPrimary = leagueIds?.[0];
      if (selectedSport && nextPrimary) {
        fetchFilters({
          sport_id: selectedSport,
          tournament_id: nextPrimary,
          start_time: selectedDate || null,
        });
      }
    },
    [fetchFilters, selectedSport, selectedDate]
  );

  const handleApply = useCallback(() => {
    onApply?.({
      date: selectedDate,
      sport: selectedSport,
      leagues: selectedLeagues,
      teams: selectedTeams,
      // If you want API-ready:
      // tournament_id: primaryLeague || null,
      // team_id: selectedTeams.length ? selectedTeams.join(",") : null,
    });
  }, [onApply, selectedDate, selectedSport, selectedLeagues, selectedTeams]);

  const handleReset = useCallback(() => {
    setSelectedDate("");
    setSelectedSport("");
    setSelectedLeagues([]);
    setSelectedTeams([]);
    reset();
    onReset?.();
  }, [onReset, reset]);

  if (!isOpen) return null;

  const busy = loading || loadingServer;

  return (
    <section className={styles.panel} aria-label="Filters">
      <header className={styles.header}>
        <button
          type="button"
          onClick={handleReset}
          className={styles.reset}
          disabled={busy}
        >
          Reset all
        </button>
        <button
          type="button"
          onClick={handleApply}
          className={styles.apply}
          disabled={busy}
        >
          APPLY
        </button>
      </header>

      {loading ? (
        <div className={styles.loadingWrapper}>
          <p>Loading filters...</p>
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.group}>
            <label className={styles.label}>Select Date</label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="dd/mm/yyyy"
              enabledDates={data?.dates}
              onOpen={handleDateOpen}
              onDateSelect={handleDateSelect}
              loading={loadingServer}
            />
          </div>

          <SelectField
            label="Select Sport"
            value={selectedSport}
            onChange={handleSportChange}
            disabled={loadingServer}
            placeholder="All Sports"
            options={sportsOptions.filter((o) => o.value !== "")}
          />

          <MultiSelectField
            label="Select League"
            value={selectedLeagues}
            onChange={handleLeagueChange}
            options={leagueOptions}
            placeholder={
              selectedSport ? "Select League" : "Select a sport first"
            }
            displayMode="labels"
            disabled={!selectedSport || loadingServer}
          />

          <MultiSelectField
            label="Select Team"
            value={selectedTeams}
            onChange={setSelectedTeams}
            options={teamOptions}
            placeholder="Select Team"
            displayMode="labels"
            disabled={
              !selectedSport || selectedLeagues.length === 0 || loadingServer
            }
          />
        </div>
      )}
    </section>
  );
}
