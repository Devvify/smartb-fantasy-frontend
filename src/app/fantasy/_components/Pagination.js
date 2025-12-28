'use client';

export default function Pagination({ currentPage, totalPages, onPageChange, resultsPerPage, onResultsPerPageChange }) {
  return (
    <div className="pagination">
      <div className="results-per-page">
        <span>Results per page</span>
        <select 
          value={resultsPerPage} 
          onChange={(e) => onResultsPerPageChange(Number(e.target.value))}
          className="page-size-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="page-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-btn"
          aria-label="Previous page"
        >
          ‹
        </button>
        
        <span className="page-info">
          {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="page-btn"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
