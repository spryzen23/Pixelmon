import { Button } from "./Button";

export function Pagination({ page, totalPages, onPageChange, className = "" }) {
  if (totalPages <= 1) return null;

  return (
    <div className={`px-pagination ${className}`}>
      <Button sm disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </Button>
      <span className="px-pagination-label">
        Page {page} / {totalPages}
      </span>
      <Button
        sm
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
