'use client';

const statusOptions = [
  { id: '1', label: 'UPCOMING' },
  { id: '2', label: 'LIVE' },
  { id: '3', label: 'COMPLETED' },
];

export default function StatusTabs({ activeStatus, onStatusChange }) {
  return (
    <div className="status-tabs">
      {statusOptions.map((status) => (
        <button
          key={status.id}
          className={`status-tab ${activeStatus === status.id ? 'active' : ''}`}
          onClick={() => onStatusChange(status.id)}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
}
