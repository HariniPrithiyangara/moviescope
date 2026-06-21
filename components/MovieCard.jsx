'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { useApp } from './AppContext';

export default function MovieCard({ movie }) {
  const { addFavorite, removeFavorite, isFavorite } = useApp();
  
  const { Title, Year, imdbID, Poster, imdbRating, Genre } = movie;
  const isFav = isFavorite(imdbID);

  // Extract first genre tag
  const primaryGenre = Genre && Genre !== 'N/A' ? Genre.split(',')[0] : movie.Type ? movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1) : 'Movie';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(imdbID);
    } else {
      addFavorite(movie);
    }
  };

  // Image Fallback Renderer
  const hasPoster = Poster && Poster !== 'N/A';

  return (
    <Link href={`/movie/${imdbID}`} className="group relative block w-full">
      <div className="flex flex-col h-full rounded-2xl overflow-hidden glass-card border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transform hover:-translate-y-1.5 transition-all duration-300">
        
        {/* Poster Wrapper */}
        <div className="relative aspect-[2/3] w-full bg-slate-900 overflow-hidden poster-container">
          {hasPoster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={Poster}
              alt={Title}
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-indigo-950 text-center select-none">
              <span className="text-4xl mb-3">🎬</span>
              <span className="text-sm font-semibold text-slate-300 tracking-wide line-clamp-2 px-2">
                {Title}
              </span>
            </div>
          )}

          {/* Rating Badge */}
          {imdbRating && imdbRating !== 'N/A' && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md rounded-lg shadow-md border border-white/10">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span>{imdbRating}</span>
            </div>
          )}

          {/* Genre Tag */}
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white bg-indigo-600/90 backdrop-blur-md rounded-lg shadow-md border border-indigo-500/20">
            {primaryGenre}
          </div>

          {/* Hover Overlay Favorites Trigger */}
          <button
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className="absolute bottom-3 right-3 z-10 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-white/10 hover:border-indigo-500/30 text-white shadow-lg active:scale-95 transition-all duration-200 group-hover:opacity-100 cursor-pointer"
          >
            <Heart
              size={16}
              className={`${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-300 hover:text-rose-500'}`}
            />
          </button>
        </div>

        {/* Content Description */}
        <div className="flex flex-col flex-grow p-4.5 justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1 transition-colors duration-200">
              {Title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <span>{Year}</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 text-[10px] uppercase font-bold tracking-wider">
              {movie.Type || 'Movie'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
