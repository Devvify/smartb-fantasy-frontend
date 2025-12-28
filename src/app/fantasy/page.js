"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/fantasy/_components/Header/Header";
import Footer from "@/app/fantasy/_components/Footer/Footer";
import NextEventsCarousel from "@/app/fantasy/_components/NextEventsCarousel/NextEventsCarousel";
import PageHeader from "@/app/fantasy/_components/PageHeader/PageHeader";
import SportTabs from "@/app/fantasy/_components/SportTabs/SportTabs";
import StatusTabs from "@/app/fantasy/_components/StatusTabs/StatusTabs";
import FiltersAccordion from "@/app/fantasy/_components/FiltersAccordion/FiltersAccordion";
import CompetitionCard from "@/app/fantasy/_components/CompetitionCard/CompetitionCard";
import styles from "./page.module.css";
import Image from "next/image";
import { fetchSportBySportTypeId } from "@/lib/api";

export default function FantasyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial values from URL or use defaults
  const getInitialSport = () => searchParams.get("sports") || "all";
  const getInitialStatus = () => {
    const statusParam = searchParams.get("status");
    const statusMap = { 1: "upcoming", 2: "live", 3: "completed" };
    return statusMap[statusParam] || "upcoming";
  };
  const getInitialContestType = () => searchParams.get("contestType") || "paid";

  const [activeSport, setActiveSport] = useState(getInitialSport());
  const [activeSportApiId, setActiveSportApiId] = useState(null);
  const [activeStatus, setActiveStatus] = useState(getInitialStatus());
  const [competitionType, setCompetitionType] = useState(
    getInitialContestType()
  );
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [sportData, setSportData] = useState(null);

  // Fetch sport data with sportTypeId=2 and map API ID if sport is in URL
  useEffect(() => {
    const fetchSportData = async () => {
      try {
        const data = await fetchSportBySportTypeId(2);
        setSportData(data);

        // Map sport from URL to API ID
        const initialSport = searchParams.get("sports") || "all";
        if (initialSport !== "all" && data?.result) {
          const sportNameToId = {
            cricket: 4,
            football: 8,
            aussierules: 9,
            basketball: 10,
            rugbyleague: 12,
          };
          const apiId = sportNameToId[initialSport];
          if (apiId) {
            setActiveSportApiId(apiId);
          }
        }
      } catch (err) {
        console.error("Error fetching sport data:", err);
      }
    };

    fetchSportData();
  }, [searchParams]);

  const fetchFilterOptions = useCallback(async () => {
    if (filterOptions) return;

    setLoadingFilters(true);
    try {
      const response = await fetch(
        `https://au.testing.smartb.com.au/fantasy-ms/api/v1/fantasy/event-list/filters?status=${activeStatus}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filter options");
      }

      const result = await response.json();
      setFilterOptions(result);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    } finally {
      setLoadingFilters(false);
    }
  }, [activeStatus, filterOptions]);

  const fetchCompetitions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Map status to numeric value
      const statusMap = {
        upcoming: "1",
        live: "2",
        completed: "3",
      };

      // Build API query parameters
      const apiParams = new URLSearchParams({
        perPage: itemsPerPage.toString(),
        page: currentPage.toString(),
        compType: activeSport,
        SportId: activeSportApiId ? activeSportApiId.toString() : "",
        eventType: competitionType,
        status: activeStatus,
        comp_id: competitionType === "paid" ? "1" : "2",
        timezone: encodeURIComponent(timezone),
      });

      const response = await fetch(
        `https://au.testing.smartb.com.au/fantasy-ms/api/v1/fantasy/event-list?${apiParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch competitions");
      }

      const data = await response.json();
      setCompetitions(data.result || []);

      // Calculate total pages from count
      const totalCount = data.count || 0;
      const calculatedPages = Math.ceil(totalCount / itemsPerPage);
      setTotalPages(calculatedPages || 1);

      // Update browser URL
      const urlParams = new URLSearchParams({
        sports: activeSport,
        status: statusMap[activeStatus] || "1",
        contestType: competitionType,
      });
      router.push(`/fantasy?${urlParams}`, { scroll: false });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching competitions:", err);
    } finally {
      setLoading(false);
    }
  }, [
    activeSport,
    activeSportApiId,
    activeStatus,
    competitionType,
    currentPage,
    itemsPerPage,
    router,
  ]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleSportChange = (apiId, id) => {
    setActiveSport(id);
    setActiveSportApiId(apiId);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handleCompetitionTypeChange = (type) => {
    setCompetitionType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleFiltersApply = (filters) => {
    setIsFiltersOpen(false);
    // Add filter logic here
  };

  const handleFiltersReset = () => {
    setFilterOptions(null);
    setIsFiltersOpen(false);
    fetchCompetitions();
  };

  return (
    <div className={styles.page}>
      <NextEventsCarousel />

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <PageHeader
            breadcrumbs={[
              { label: "HOME", href: "/" },
              { label: "SMARTPLAY", href: "/fantasy" },
              { label: "ALL COMPETITIONS" },
            ]}
            title="All Competitions"
          />

          <SportTabs
            activeSport={activeSport}
            onSportChange={handleSportChange}
            sportData={sportData}
          />

          <StatusTabs
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
          />

          <div className={styles.controlsRow}>
            <div className={styles.typeToggleWrap}>
              <button
                type="button"
                className={`${styles.typePill} ${
                  competitionType === "paid" ? styles.typePillActive : ""
                }`}
                onClick={() => handleCompetitionTypeChange("paid")}
              >
                <Image
                  src="/light-smart-b-coins.png"
                  alt="SmartCoins"
                  width={83}
                  height={19}
                  priority
                />
                <span className={styles.pillText}>COMPETITIONS</span>
              </button>

              <button
                type="button"
                className={`${styles.typePill} ${
                  competitionType === "free" ? styles.typePillActive : ""
                }`}
                onClick={() => handleCompetitionTypeChange("free")}
              >
                <span className={styles.pillText}>FREE COMPETITIONS</span>
              </button>
            </div>

            <button
              type="button"
              className={styles.filtersBtn}
              onClick={() => {
                if (!isFiltersOpen) {
                  fetchFilterOptions();
                }
                setIsFiltersOpen(!isFiltersOpen);
              }}
            >
              <span className={styles.filtersText}>Filters</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{
                  transform: isFiltersOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.3s",
                }}
              >
                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>
          </div>

          <FiltersAccordion
            isOpen={isFiltersOpen}
            onApply={handleFiltersApply}
            onReset={handleFiltersReset}
            filterOptions={{ ...filterOptions, status: activeStatus }}
            loading={loadingFilters}
          />

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading competitions...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>Error: {error}</p>
              <button onClick={fetchCompetitions} className={styles.retryBtn}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && competitions.length === 0 && (
            <div className={styles.empty}>
              <p>No competitions available at the moment.</p>
            </div>
          )}

          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              {!loading && !error && competitions.length > 0 && (
                <>
                  <div className={styles.grid}>
                    {competitions.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        competition={competition}
                      />
                    ))}
                  </div>

                  <div className={styles.paginationBar}>
                    <div className={styles.paginationRight}>
                      <div className={styles.perPage}>
                        <span className={styles.perPageLabel}>
                          Results per page
                        </span>

                        <div className={styles.selectWrap}>
                          <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className={styles.perPageSelect}
                            aria-label="Results per page"
                          >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                          </select>

                          <span
                            className={styles.selectCaret}
                            aria-hidden="true"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className={styles.pager}>
                        <button
                          type="button"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={styles.pagerBtn}
                          aria-label="Previous page"
                        >
                          ‹
                        </button>

                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = Number(e.target.value);
                            if (!Number.isFinite(page)) return;
                            if (page >= 1 && page <= totalPages)
                              handlePageChange(page);
                          }}
                          className={styles.pageNumber}
                          aria-label="Page number"
                        />

                        <button
                          type="button"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={styles.pagerBtn}
                          aria-label="Next page"
                        >
                          ›
                        </button>

                        <span className={styles.ofText}>
                          of{" "}
                          <span className={styles.totalPages}>
                            {totalPages}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
