'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { MovieGridSkeleton } from '@/components/Loader';
import { searchMovies } from '@/lib/omdb';
import { Film, AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('Space'); // Default curated search term for initial page load
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isOfflineMock, setIsOfflineMock] = useState(false);

  const fetchMoviesData = useCallback(async (search, page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(search, page);
      if (data.Response === 'True') {
        setMovies(data.movies || []);
        setTotalResults(data.totalResults || 0);
        setIsOfflineMock(!!data.isMock);
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(data.Error || 'No movies found.');
      }
    } catch (err) {
      setMovies([]);
      setTotalResults(0);
      setError(err.message || 'An error occurred while fetching movies.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and page change
  useEffect(() => {
    fetchMoviesData(searchTerm, currentPage);
  }, [currentPage, searchTerm, fetchMoviesData]);

  const handleSearchSubmit = (newSearchTerm) => {
    const search = newSearchTerm.trim() || 'Space';
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalResults / 12); // R1: exactly 12 results per page

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative">
        {/* Decorative Background Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {/* API Limit Warning Banner */}
        {isOfflineMock && (
          <div className="max-w-xl mx-auto mb-8 px-4 py-3 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 rounded-xl text-center text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-2 shadow-sm">
            <AlertCircle size={14} className="animate-pulse" />
            <span>API rate-limited or offline. Showing popular movies from mock database.</span>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
            Discover Your Next <br className="hidden sm:inline" />
            <span className="text-gradient-primary">Favorite Movie</span>
          </h1>
          
          <p className="max-w-md mx-auto text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            Search thousands of movies, explore ratings, and build your personal watchlist.
          </p>
        </div>

        {/* Search Bar Container */}
        <SearchBar query={query} setQuery={setQuery} onSearch={handleSearchSubmit} />

        {/* Movies Grid Section */}
        <div className="mt-16 sm:mt-24">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200/60 dark:border-white/5 pb-4.5 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                {searchTerm === 'Space' ? 'Trending Now' : `Results for "${searchTerm}"`}
              </h2>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                {loading ? 'Finding movies...' : `${totalResults} movie${totalResults !== 1 ? 's' : ''} found`}
              </p>
            </div>
            
            {/* Quick Refresh */}
            <button
              onClick={() => fetchMoviesData(searchTerm, currentPage)}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-100 hover:bg-slate-200/60 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Grid Layout or Fallbacks */}
          {loading ? (
            <MovieGridSkeleton count={12} />
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 glass-card border border-rose-500/10 rounded-2xl mt-10">
              <div className="p-4 rounded-full bg-rose-500/10 dark:bg-rose-500/5 text-rose-500 border border-rose-500/20 mb-4 animate-bounce">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Search Failed
              </h3>
              <p className="max-w-xs text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {error}
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSearchTerm('Space');
                  setCurrentPage(1);
                }}
                className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs tracking-wide shadow-md hover:bg-indigo-500 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 glass-card border border-slate-200/60 dark:border-white/5 rounded-2xl mt-10">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-800/80 mb-4">
                <Film size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                No Movies Found
              </h3>
              <p className="max-w-xs text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                We couldn&apos;t find any movies matching &ldquo;{searchTerm}&rdquo;. Try another keyword.
              </p>
            </div>
          ) : (
            <>
              {/* Movies Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-10">
                {movies.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-[#070913]/60 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-tight text-slate-800 dark:text-white">
              Movie<span className="text-gradient-primary">Scope</span>
            </span>
            <span className="text-[10px] text-slate-300 dark:text-slate-800 hidden sm:inline">|</span>
            <p className="hidden sm:block">© 2026 MovieScope. All rights reserved.</p>
          </div>
          <p className="sm:hidden text-center">© 2026 MovieScope. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <span className="text-indigo-500 dark:text-indigo-400 font-bold tracking-wide">Built for Jeevan — Harini Prithiyangara B</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-200">Privacy</span>
              <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-200">Terms</span>
              <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-200">OMDb API</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
