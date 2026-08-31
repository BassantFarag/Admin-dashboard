function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white">

      <span className="text-sm text-slate-500">
        Page {currentPage} of {totalPages || 1}
      </span>

      <div className="flex gap-2">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-2 border rounded-lg disabled:opacity-50"
        >
          ‹
        </button>

        <span className="px-3 py-2 bg-slate-900 text-white rounded-lg">
          {currentPage}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-2 border rounded-lg disabled:opacity-50"
        >
          ›
        </button>

      </div>
    </div>
  );
}

export default Pagination;
