'use client';

import React from 'react';

// General Spinner Loader
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-600 dark:border-indigo-400/10 dark:border-t-indigo-400 animate-spin" />
        {/* Inner pulsing dot */}
        <div className="absolute w-4 h-4 rounded-full bg-purple-500 dark:bg-purple-400 animate-ping" />
      </div>
      <span className="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase animate-pulse">
        Loading Movies...
      </span>
    </div>
  );
}

// Skeletons for the Main Grid
export function MovieGridSkeleton({ count = 8 }) {
  const skeletons = Array(count).fill(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-10">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="flex flex-col h-full rounded-2xl overflow-hidden glass-card border border-slate-200/40 dark:border-white/5 animate-pulse"
        >
          {/* Poster placeholder */}
          <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-slate-900/80" />
          
          {/* Details placeholder */}
          <div className="p-4.5">
            <div className="h-4.5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-3" />
            <div className="flex items-center justify-between mt-3">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for the Movie Details Page
export function MovieDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 animate-pulse">
      {/* Back button skeleton */}
      <div className="w-28 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl mb-8" />

      {/* Main layout skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Left: Poster */}
        <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />

        {/* Right: Info */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl w-2/3 mb-4" />
          
          {/* Metadata chips */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            <div className="w-16 h-6.5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="w-20 h-6.5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="w-24 h-6.5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>

          {/* Ratings grid */}
          <div className="grid grid-cols-3 gap-4.5 mb-8 max-w-md">
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>

          {/* Plot skeleton */}
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-11/12" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-4/5" />
          </div>

          {/* Key fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
