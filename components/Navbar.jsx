'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Film, Heart } from 'lucide-react';
import { useApp } from './AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, favorites } = useApp();

  const isLinkActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Film size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              Movie<span className="text-gradient-primary">Scope</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-4">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                isLinkActive('/')
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
              }`}
            >
              Home
            </Link>
            
            <Link
              href="/favorites"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                isLinkActive('/favorites')
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
              }`}
            >
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-all duration-200 active:scale-95"
            >
              {theme === 'dark' ? (
                <Sun size={20} className="animate-spin-slow" />
              ) : (
                <Moon size={20} className="hover:-rotate-12 transition-transform duration-200" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
