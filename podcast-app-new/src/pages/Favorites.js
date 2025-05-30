import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('favoritePrefs'));
    if (savedPreferences) {
      setFilterText(savedPreferences.filterText || '');
      setShowFilter(savedPreferences.showFilter || 'all');
      setSortBy(savedPreferences.sortBy || 'date-desc');
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'favoritePrefs',
      JSON.stringify({ filterText, showFilter, sortBy })
    );
  }, [filterText, showFilter, sortBy]);

  const handleRemoveFavorite = (episodeToRemove) => {
    const updatedFavorites = favorites.filter(
      (ep) =>
        !(
          ep.showId === episodeToRemove.showId &&
          ep.season === episodeToRemove.season &&
          ep.episodeId === episodeToRemove.episodeId
        )
    );
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredAndSortedFavorites = useMemo(() => {
    return [...favorites]
      .filter((fav) => {
        const matchesText = (fav?.title || '').toLowerCase().includes(filterText.toLowerCase());
        const matchesShow = showFilter === 'all' || fav.showTitle === showFilter;
        return matchesText && matchesShow;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return new Date(a.favouritedAt) - new Date(b.favouritedAt);
          case 'title-asc':
            return (a.title || '').localeCompare(b.title || '');
          case 'title-desc':
            return (b.title || '').localeCompare(a.title || '');
          case 'date-desc':
          default:
            return new Date(b.favouritedAt) - new Date(a.favouritedAt);
        }
      });
  }, [favorites, filterText, showFilter, sortBy]);

  const groupedFavourites = useMemo(() => {
    return filteredAndSortedFavorites.reduce((acc, episode) => {
      const { showTitle, season } = episode;
      if (!acc[showTitle]) acc[showTitle] = {};
      if (!acc[showTitle][season]) acc[showTitle][season] = [];
      acc[showTitle][season].push(episode);
      return acc;
    }, {});
  }, [filteredAndSortedFavorites]);

  if (favorites.length === 0) {
    return <p>No favorites yet.</p>;
  }

  return (
    <div className="favorites-container">
      <h1 className="favorites-heading">My Favorite Podcasts</h1>

      <div className="favorites-controls">
        <input
          type="text"
          placeholder="Search episode title..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="favorites-search"
        />

        <button
          onClick={() => {
            if (window.confirm("Clear all favorites?")) {
              localStorage.removeItem('favorites');
              setFavorites([]);
            }
          }}
          className="favorites-clear-btn"
        >
          Clear All Favorites
        </button>

        <label className="favorites-label">
          Show:
          <select
            value={showFilter}
            onChange={(e) => setShowFilter(e.target.value)}
            className="favorites-select"
          >
            <option value="all">All Shows</option>
            {[...new Set(favorites.map((f) => f.showTitle))].map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </label>

        <label className="favorites-label">
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="favorites-select"
          >
            <option value="date-desc">Date Added (Newest)</option>
            <option value="date-asc">Date Added (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </label>
      </div>

      {filteredAndSortedFavorites.length === 0 ? (
        <p className="no-results">No matching favorites found.</p>
      ) : (
        Object.entries(groupedFavourites).map(([showTitle, seasons]) => (
          <div key={showTitle} className="favorites-show">
            <h2 className="show-title">{showTitle}</h2>
            {Object.entries(seasons).map(([seasonNumber, episodes]) => (
              <div key={seasonNumber} className="season-group">
                <h3 className="season-title">Season {seasonNumber}</h3>
                <ul className="episode-list">
                  {episodes.map((ep) => (
                    <li key={`${ep.showId}-${ep.season}-${ep.episodeId}`} className="episode-item">
                      <div className="episode-thumbnail">
                        <Link to={`/show/${ep.showId}`}>
                          <img
                            src={ep.image || '/placeholder.jpg'}
                            alt={ep.showTitle}
                            width={190}
                            height={120}
                            onError={(e) => (e.target.src = '/placeholder.jpg')}
                            className="episode-image"
                          />
                        </Link>
                      </div>
                      <div className="episode-info">
                        <p className="episode-title">{ep.title}</p>
                        <p className="episode-date">Added: {new Date(ep.favouritedAt).toLocaleString()}</p>
                        <Link to={`/show/${ep.showId}`} className="episode-show-link">
                          {ep.showTitle}
                        </Link>
                      </div>
                      <div className="episode-action">
                        <button
                          onClick={() => handleRemoveFavorite(ep)}
                          className="remove-button"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Favorites;
