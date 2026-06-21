'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page) => {
    if (page !== '...') {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper to build page range matching the UI
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mt-12 sm:mt-16 mb-8">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:hover:border-slate-200/60 disabled:hover:text-slate-600 dark:disabled:hover:border-slate-800 dark:disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        const isCurrent = page === currentPage;
        const isEllipsis = page === '...';

        return (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={isEllipsis}
            className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 flex items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isCurrent
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : isEllipsis
                ? 'text-slate-400 dark:text-slate-600 cursor-default'
                : 'border border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 cursor-pointer'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:hover:border-slate-200/60 disabled:hover:text-slate-600 dark:disabled:hover:border-slate-800 dark:disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
