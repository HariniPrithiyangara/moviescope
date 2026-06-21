'use client';

import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ query, setQuery, onSearch }) {
  const suggestions = ['Interstellar', 'Dune', 'Oppenheimer', 'The Batman'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleSuggestionClick = (tag) => {
    setQuery(tag);
    onSearch(tag);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8 sm:mt-12">
      <form onSubmit={handleSubmit} className="relative flex items-center group w-full">
        {/* Glow effect on hover/focus */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300 -z-10" />

        <div className="relative flex items-center w-full rounded-2xl glass-card border border-slate-200/50 dark:border-white/10 overflow-hidden shadow-xl focus-within:border-indigo-500/50 dark:focus-within:border-indigo-400/50 transition-all duration-300">
          <div className="pl-4.5 text-slate-400 dark:text-slate-500">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, genres, directors..."
            className="w-full py-4.5 px-4 bg-transparent border-none outline-none text-base text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
          />

          <button
            type="submit"
            className="mr-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-sm tracking-wide shadow-md hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 active:scale-97 cursor-pointer hover:shadow-indigo-500/20"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggested Search Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 sm:mt-5">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 tracking-wider uppercase">
          Popular:
        </span>
        {suggestions.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSuggestionClick(tag)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-400/60 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
