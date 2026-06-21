'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Load theme and favorites from localStorage on mount
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('moviescope_theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Favorites setup
    const savedFavorites = localStorage.getItem('moviescope_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error parsing favorites', e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('moviescope_theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    showToast(`Switched to ${nextTheme} theme`, 'info');
  };

  const addFavorite = (movie) => {
    if (favorites.some((m) => m.imdbID === movie.imdbID)) return;
    
    const updated = [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem('moviescope_favorites', JSON.stringify(updated));
    showToast(`Added "${movie.Title}" to favorites`, 'success');
  };

  const removeFavorite = (imdbID) => {
    const movie = favorites.find((m) => m.imdbID === imdbID);
    const updated = favorites.filter((m) => m.imdbID !== imdbID);
    setFavorites(updated);
    localStorage.setItem('moviescope_favorites', JSON.stringify(updated));
    if (movie) {
      showToast(`Removed "${movie.Title}" from favorites`, 'info');
    }
  };

  const isFavorite = (imdbID) => {
    return favorites.some((m) => m.imdbID === imdbID);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toast,
        showToast,
      }}
    >
      {children}
      
      {/* Premium custom Toast notification */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl glass-card border border-indigo-500/20 animate-fade-in transition-all duration-300">
          <div className={`w-3 h-3 rounded-full ${
            toast.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
            toast.type === 'info' ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 
            'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
          }`} />
          <span className="text-sm font-medium tracking-wide text-slate-800 dark:text-slate-200">
            {toast.message}
          </span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
