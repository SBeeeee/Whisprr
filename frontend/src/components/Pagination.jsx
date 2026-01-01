export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex items-center justify-end gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
  
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
  
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  }
  