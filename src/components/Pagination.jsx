import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const validTotalPages = totalPages && totalPages > 0 ? totalPages : 1;

  return (
    <div className="flex items-center justify-between p-4 bg-card border-t border-border-custom text-secondary">
      {/* Page Info */}
      <span className="text-sm">
        Page <span className="font-medium text-primary">{currentPage}</span> of{" "}
        <span className="font-medium text-primary">{validTotalPages}</span>
      </span>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 border border-border-custom rounded-lg bg-input hover:bg-card text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Current Page Badge */}
        <span className="px-3.5 py-1.5 bg-primary text-card font-semibold rounded-lg text-sm shadow-sm">
          {currentPage}
        </span>

        {/* Next Button */}
        <button
          disabled={currentPage >= validTotalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, validTotalPages))}
          className="p-2 border border-border-custom rounded-lg bg-input hover:bg-card text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
