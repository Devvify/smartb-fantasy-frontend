"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextEventsCarousel from "@/components/NextEventsCarousel";
import SportTabs from "@/components/SportTabs";
import StatusTabs from "@/components/StatusTabs";
import CompetitionCard from "@/components/CompetitionCard";
import styles from "./page.module.css";

export default function FantasyPage() {
  const [activeSport, setActiveSport] = useState("all");
  const [activeStatus, setActiveStatus] = useState("upcoming");
  const [competitionType, setCompetitionType] = useState("paid");
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompetitions();
  }, [activeSport, activeStatus, competitionType, currentPage, itemsPerPage]);

  const fetchCompetitions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        sport: activeSport,
        status: activeStatus,
        type: competitionType,
        page: currentPage,
        limit: itemsPerPage,
      });

      const response = await fetch(`/api/competitions?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch competitions");
      }

      const data = await response.json();
      setCompetitions(data.competitions || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching competitions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSportChange = (sport) => {
    setActiveSport(sport);
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

  return (
    <div className={styles.page}>
      <NextEventsCarousel />

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>All Competitions</h1>
            <SportTabs
              activeSport={activeSport}
              onSportChange={handleSportChange}
            />
          </div>

          <StatusTabs
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
          />

          <div className={styles.controls}>
            <div className={styles.typeToggle}>
              <button
                className={`${styles.toggleBtn} ${
                  competitionType === "paid" ? styles.toggleBtnActive : ""
                }`}
                onClick={() => handleCompetitionTypeChange("paid")}
              >
                COMPETITIONS
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  competitionType === "free" ? styles.toggleBtnActive : ""
                }`}
                onClick={() => handleCompetitionTypeChange("free")}
              >
                FREE COMPETITIONS
              </button>
            </div>

            <button className={styles.filterBtn}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
              </svg>
              Filters
            </button>
          </div>

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

                  <div className={styles.pagination}>
                    <div className={styles.paginationInfo}>
                      <span>Results per page</span>
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className={styles.pageSelect}
                      >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                    </div>

                    <div className={styles.paginationControls}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={styles.pageBtn}
                      >
                        Previous
                      </button>

                      <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={styles.pageBtn}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <aside className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>Next events</h3>
              <div className={styles.sidebarContent}>
                <p className={styles.sidebarPlaceholder}>No upcoming events</p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
