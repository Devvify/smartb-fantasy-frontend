'use client';

export default function Error({ error, reset }) {
  return (
    <div className="fantasy-page">
      <div className="page-header">
        <h1>All Competitions</h1>
      </div>

      <div className="error-state">
        <h2>Something went wrong!</h2>
        <p>{error.message || 'Failed to load competitions'}</p>
        <button onClick={() => reset()}>Try again</button>
      </div>
    </div>
  );
}
