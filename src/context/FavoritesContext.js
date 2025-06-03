import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (episode) => {
    if (!favorites.some((ep) => ep.id === episode.id)) {
      setFavorites((prev) => [...prev, { ...episode, favouritedAt: new Date().toISOString() }]);
    }
  };

  const removeFavorite = (episodeId) => {
    setFavorites((prev) => prev.filter((ep) => ep.id !== episodeId));
  };

  const isFavorited = (episodeId) => favorites.some((ep) => ep.id === episodeId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorited }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
