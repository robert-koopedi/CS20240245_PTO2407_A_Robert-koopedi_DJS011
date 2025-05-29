// src/context/FavoritesContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (episode) => {
    const isAlreadyFavorited = favorites.some(ep => ep.episodeId === episode.episodeId);
    if (isAlreadyFavorited) return;

    const newFavorite = {
      ...episode,
      favouritedAt: new Date().toISOString(),
    };

    setFavorites(prev => [...prev, newFavorite]);
  };

  const removeFavorite = (episodeId) => {
    setFavorites(prev => prev.filter(ep => ep.episodeId !== episodeId));
  };

  const isFavorited = (episodeId) => {
    return favorites.some(ep => ep.episodeId === episodeId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
