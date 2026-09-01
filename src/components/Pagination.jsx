import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const validTotalPages = totalPages && totalPages > 0 ? totalPages : 1;


  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3; 
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(validTotalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card/80 border border-border-custom shadow-lg backdrop-blur-md text-secondary">
      {/* Page Info */}
      <div className="text-xs sm:text-sm font-medium">
        Showing page <span className="font-semibold text-primary font-mono">{currentPage}</span> of{" "}
        <span className="font-semibold text-primary font-mono">{validTotalPages}</span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 border border-border-custom rounded-xl bg-input/50 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[36px] h-9 px-2 text-xs font-semibold font-mono rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-tr from-amber-500 to-amber-400 text-zinc-950 shadow-md shadow-amber-500/20 font-bold scale-105"
                    : "bg-input/30 text-secondary border border-transparent hover:border-border-custom hover:text-primary"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          disabled={currentPage >= validTotalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, validTotalPages))}
          className="p-2 border border-border-custom rounded-xl bg-input/50 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;